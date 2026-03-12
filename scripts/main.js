const userConsomation = {
    username: "John",
    lastTimeConsumed: null,
    lastTimeConsumedUnix: 1773153026,
    nextAlarm: null,
    waterConsumed: 0,
    consumptionTarget: 2300
}

// store
localStorage.setItem('userConsomation', JSON.stringify(userConsomation));

// retrieve
const usuarioGuardado = JSON.parse(localStorage.getItem('userConsomation'));

function UnixToTime(input) {
    const date = new Date(input * 1000);
    const hora = date.toLocaleTimeString('es-ES', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return hora;
}

// function getLocation() {
//     navigator.geolocation.getCurrentPosition((position) => {
//         return console.table(position.coords.longitude);
//     });
// }

function getUserLocation(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("La geolocalizacion no esta disponible."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        reject(new Error("No se pudo obtener la ubicacion del usuario: " + err.message));
      },
      options
    );
  });
}

const salida = [];

/*async function init() {
  try {
    const { latitude, longitude } = await getUserLocation();
    salida.push(latitude, longitude);
    console.log("Salida:", salida);
  } catch (e) {
    console.error(e);
  }
    init();
}*/



// when the document is loaded
document.addEventListener('DOMContentLoaded', function () {

    /*const maindiv = document.querySelector('.main-container');
    maindiv.innerHTML = `<h1>H2O Please!</h1>
    <div class="objective">Su objetivo personal es ${userConsomation.consumptionTarget}ml</div>
    <div class="accumulated">${userConsomation.username} ha bebido ${userConsomation.waterConsumed}ml.</div>
    <div class="next-alarm"> ${userConsomation.nextAlarm ? `Siguiente alarma en ${userConsomation.nextAlarm}` : "No hay primera toma registrada."}</div>
    <button class="drink">Beber</button>`*/

    const button = document.querySelector(".drink");
    if (button) {
        button.onclick = function () {
            userConsomation.lastTimeConsumedUnix = Math.floor(new Date().getTime() / 1000);
            userConsomation.lastTimeConsumed = new Date();
            userConsomation.waterConsumed += 200;
            userConsomation.nextAlarm = userConsomation.lastTimeConsumedUnix;
            document.querySelector(".accumulated").innerHTML = `${userConsomation.username} ha bebido ${userConsomation.waterConsumed}ml.`;
            document.querySelector(".next-alarm").innerHTML = `Siguiente toma a las ${UnixToTime(userConsomation.lastTimeConsumedUnix + 1800)}`;
            console.log(userConsomation)
        };
    }
})
    /* reloj normal actualizaciÃ³n cada segundo
    const hora = document.querySelector('.next-alarm');

    const updateTime = () => {
        const date = new Date();
        hora.innerHTML = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
    }
    setInterval(updateTime, 1000)
    */
