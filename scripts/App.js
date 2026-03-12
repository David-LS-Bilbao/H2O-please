import DOMManager from "./managers/DOMManager.js";

const userConsomation = {
    username: "John",
    lastTimeConsumed: null,
    lastTimeConsumedUnix: 1773153026,
    nextAlarm: null,
    waterConsumed: 0,
    consumptionTarget: 2300
}

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

// store
localStorage.setItem('userConsomation', JSON.stringify(userConsomation));

// retrieve
const usuarioGuardado = JSON.parse(localStorage.getItem('userConsomation'));


class App {
    constructor(){
        this.DOMManager = new DOMManager
    }
    init(){
        this.DOMManager.renderHTML();
        //remapear        
        document.addEventListener('DOMContentLoaded', function () {
            const button = document.querySelector(".drink-button");
            if (button) {
                button.onclick = function () {
                    userConsomation.lastTimeConsumedUnix = Math.floor(new Date().getTime() / 1000);
                    userConsomation.lastTimeConsumed = new Date();
                    userConsomation.waterConsumed += 200;
                    userConsomation.nextAlarm = userConsomation.lastTimeConsumedUnix;
                    document.querySelector("#total").innerHTML = `${userConsomation.waterConsumed}ml`;
                    //document.querySelector(".acumulated").innerHTML = `${userConsomation.username} ha bebido ${userConsomation.waterConsumed}ml.`;
                  //  document.querySelector("#countdown").innerHTML = `Siguiente toma cambiada`;
                    document.querySelector("#countdown").innerHTML = `Siguiente toma a las ${UnixToTime(userConsomation.lastTimeConsumedUnix + 1800)}`;

                    console.log(userConsomation)
                };
            }
        })
    }
}


export default App;