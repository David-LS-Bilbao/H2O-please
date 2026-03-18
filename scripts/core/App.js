import DOMManager from "./DOMManager.js";
import { loadCurrentUser, saveUser } from "./storage.js";

// Convierte un timestamp Unix en una hora legible para el mensaje de la siguiente alarma.
function unixToTime(unixSeconds) {
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleTimeString("es-ES", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Normaliza los campos opcionales del perfil y descarta valores vacios o invalidos.
function parseOptionalPositiveInteger(rawValue) {
  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

// Controlador principal del dashboard: coordina estado, persistencia, vistas y eventos.
class App {
  constructor() {
    // DOMManager centraliza la captura de nodos que necesita la pantalla.
    this.dom = new DOMManager();
    // `user` guarda el estado cargado desde storage durante la sesion actual.
    this.user = null;
    this.waterConsumedAnimationTimerId = null;
  }

  // Flujo de arranque del dashboard.
  init() {
    // Recupera el usuario activo; si no existe, devuelve al login.
    this.user = loadCurrentUser();
    if (!this.user) {
      window.location.href = "index.html";
      return;
    }

    // Asegura una estructura estable aunque existan datos antiguos en storage.
    if (!Array.isArray(this.user.history)) {
      this.user.history = [];
    }

    // Orden de inicializacion: cache DOM, reset diario, UI base, listeners y refresco final.
    this.dom.cacheElements();
    this.verificarNuevoDia();
    this.dom.renderInitialUI(this.user);
    this.attachListeners();
    this.updateUI();
  }

  // Reinicia el progreso si ha cambiado el dia desde la ultima sesion guardada.
  verificarNuevoDia() {
    const hoy = new Date().toLocaleDateString("es-ES");

    // Primera carga conocida: fija la fecha base sin resetear nada mas.
    if (!this.user.lastDate) {
      this.user.lastDate = hoy;
      saveUser(this.user);
      return;
    }

    // Nuevo dia: limpia consumo e historial y persiste el nuevo punto de partida.
    if (this.user.lastDate !== hoy) {
      this.user.waterConsumed = 0;
      this.user.history = [];
      this.user.lastDate = hoy;
      saveUser(this.user);
    }
  }

  // Registra todos los eventos interactivos del dashboard.
  attachListeners() {
    const {
      drinkForm,
      amountInput,
      btnToday,
      btnHistory,
      btnMe,
      editAge,
      editWeight,
      btnSaveProfile,
      btnLogout,
    } = this.dom.elements;

    // Alta de agua: valida la cantidad, actualiza modelo, historial, storage y UI.
    if (drinkForm) {
      drinkForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const amount = parseInt(amountInput.value || "200", 10);
        if (Number.isNaN(amount) || amount <= 0) {
          return;
        }

        this.user.addWater(amount);
        this.user.history.unshift({
          hora: new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          cantidad: amount,
        });

        saveUser(this.user);
        this.updateUI();
        amountInput.value = "";
      });
    }

    // Navegacion inferior entre vistas del dashboard.
    if (btnToday) {
      btnToday.addEventListener("click", () => this.cambiarPestana("today"));
    }

    if (btnHistory) {
      btnHistory.addEventListener("click", () => this.cambiarPestana("history"));
    }

    if (btnMe) {
      btnMe.addEventListener("click", () => this.cambiarPestana("me"));
    }

    // Edicion de perfil: guarda edad y peso, recalcula el objetivo y refresca la vista.
    if (btnSaveProfile) {
      // La persistencia de YO sigue la feature de Marcos, adaptada al modelo actual de esta rama.
      btnSaveProfile.addEventListener("click", () => {
        this.user.age = parseOptionalPositiveInteger(editAge?.value ?? "");
        this.user.weight = parseOptionalPositiveInteger(editWeight?.value ?? "");
        this.user.calculateTarget();
        saveUser(this.user);
        this.renderizarPerfil();
        this.updateUI();
        alert(`¡Perfil actualizado! Tu nueva meta es ${this.user.consumptionTarget} ml`);
      });
    }

    // Cierre de sesion: elimina el usuario actual y vuelve a la portada.
    if (btnLogout) {
      // Se conserva el logout de YO por compatibilidad funcional con la feature original de Marcos.
      btnLogout.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
      });
    }
  }

  // Muestra una sola pestaña a la vez y lanza el render especifico cuando hace falta.
  cambiarPestana(pestana) {
    const { viewToday, viewHistory, viewMe } = this.dom.elements;

    // Oculta primero todas las vistas para evitar solapamientos.
    if (viewToday) {
      viewToday.style.display = "none";
    }

    if (viewHistory) {
      viewHistory.style.display = "none";
    }

    if (viewMe) {
      viewMe.style.display = "none";
    }

    if (pestana === "today" && viewToday) {
      viewToday.style.display = "flex";
      return;
    }

    if (pestana === "history" && viewHistory) {
      viewHistory.style.display = "flex";
      this.renderizarHistorial();
      return;
    }

    if (pestana === "me" && viewMe) {
      viewMe.style.display = "flex";
      this.renderizarPerfil();
    }
  }

  // Pinta el historial del dia con color distinto para altas y bajas de agua.
  renderizarHistorial() {
    const { historyContainer } = this.dom.elements;
    if (!historyContainer) {
      return;
    }

    historyContainer.innerHTML = "";

    // Estado vacio cuando todavia no hay movimientos registrados.
    if (!Array.isArray(this.user.history) || this.user.history.length === 0) {
      historyContainer.innerHTML =
        '<p style="text-align:center; padding:20px;">Sin registros.</p>';
      return;
    }

    let index = 0;
    // Cada movimiento se representa como una fila simple dentro del contenedor.
    this.user.history.forEach((toma) => {

      const amount = Number(toma.cantidad) || 0;

      const item = document.createElement("div");
      item.style.cssText =
        "display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid var(--neutral-color); align-items:center;";
      item.innerHTML = `
        <span style="font-weight:bold; color:var(--neutral-color);">${toma.hora}</span>
        <span style="color:${isNegative ? "var(--negative-color)" : "var(--primary-dark-color)"}; font-weight:bold;">${isNegative ? "" : "+"}${amount} ml</span>
      `;
      const button = document.createElement("button");
      button.classList.add("trash-button");
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>';
      button.dataset.id = index;

      button.addEventListener("click", () => {
        const thisButtonId = parseInt(button.dataset.id);
        this.user.addWater(-this.user.history[thisButtonId].cantidad);
        this.user.history.splice((thisButtonId), 1);
        saveUser(this.user);
        this.renderizarHistorial()
        this.updateUI()
      })

      item.appendChild(button)
      historyContainer.appendChild(item);
      index++

    });
  }

  // Sincroniza los campos de la vista YO con el estado actual del usuario.
  renderizarPerfil() {
    const { profileName, profileTarget, editAge, editWeight } = this.dom.elements;

    if (profileName) {
      profileName.textContent = this.user.username;
    }

    if (profileTarget) {
      profileTarget.textContent = `${this.user.consumptionTarget}`;
    }

    if (editAge) {
      editAge.value = this.user.age ?? "";
    }

    if (editWeight) {
      editWeight.value = this.user.weight ?? "";
    }
  }

  // Anima el contador principal tanto al subir como al bajar la cantidad de agua.
  waterConsumedAnimation(finalNumber) {
    const { totalText } = this.dom.elements;
    if (!totalText) {
      return;
    }

    const parsedCurrentNumber = Number.parseInt(totalText.textContent ?? "0", 10);
    let currentNumber = Number.isFinite(parsedCurrentNumber) ? parsedCurrentNumber : 0;
    const targetNumber = Number.isFinite(finalNumber) ? finalNumber : 0;

    if (this.waterConsumedAnimationTimerId !== null) {
      window.clearInterval(this.waterConsumedAnimationTimerId);
      this.waterConsumedAnimationTimerId = null;
    }

    if (currentNumber === targetNumber) {
      totalText.textContent = `${targetNumber}`;
      return;
    }

    const step = currentNumber < targetNumber ? 1 : -1;

    this.waterConsumedAnimationTimerId = window.setInterval(() => {
      currentNumber += step;
      totalText.textContent = `${currentNumber}`;

      if (currentNumber === targetNumber) {
        window.clearInterval(this.waterConsumedAnimationTimerId);
        this.waterConsumedAnimationTimerId = null;
      }
    }, 1);
  }

  // Refresca los indicadores principales del dashboard con el estado mas reciente.
  updateUI() {
    const { totalText, countdown, progress, dailyTarget } = this.dom.elements;

    // Muestra la cantidad total consumida hoy con la animacion del contador.
    if (totalText) {
      this.waterConsumedAnimation(this.user.waterConsumed);
    }

    // La cuenta atras solo se muestra cuando existe una toma previa con alarma calculada.
    if (countdown) {
      if (this.user.lastTimeConsumedUnix && this.user.nextAlarm) {
        countdown.textContent = `Próximo vaso: ${unixToTime(this.user.nextAlarm)} horas`;
        countdown.style.opacity = "1";
      } else {
        countdown.textContent = "00:00";
        countdown.style.opacity = "0";
      }
    }

    // Calcula el porcentaje de progreso respecto al objetivo diario actual.
    const percent = Math.min(
      100,
      Math.round((this.user.waterConsumed / this.user.consumptionTarget) * 100)
    );

    // Actualiza la barra visual del progreso diario.
    if (progress) {
      progress.value = percent;
    }

    // Mantiene visible el objetivo activo, ya sea por defecto o recalculado por perfil.
    if (dailyTarget) {
      dailyTarget.textContent = `${this.user.consumptionTarget}`;
    }
  }
}

export default App;
