import DOMManager from "./DOMManager.js";
import { loadCurrentUser, saveUser } from "./storage.js";
import Navigation from "./Navigation.js";
import { unixToTime, parseOptionalPositiveInteger } from "./utils.js";
import { renderizarHistorial, renderizarPerfil } from "./Views.js";

// Controlador principal del dashboard: coordina estado, persistencia, vistas y eventos.
class App {
  constructor() {
    this.dom = new DOMManager();
    // `user` guarda el estado cargado desde storage durante la sesion actual. ????
    this.user = null;
    this.waterConsumedAnimationTimerId = null;
    this.isDrinkButtonDisabled = false;
    this.navigation = new Navigation();
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
    this.navigation.init();
    this.navigation.onViewChange("history", () => this.renderizarHistorial());
    this.navigation.onViewChange("me", () => this.renderizarPerfil());
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
      editAge,
      editWeight,
      btnSaveProfile,
      btnLogout,
    } = this.dom.elements;

    // Alta de agua: valida la cantidad, actualiza modelo, historial, storage y UI.
    if (drinkForm) {
      drinkForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (this.isDrinkButtonDisabled) { // preventing consecutive agregates
          return;
        }
        this.isDrinkButtonDisabled = true;
        const drinkButton = this.dom.elements.drinkButton;
        if (drinkButton) {
          drinkButton.disabled = true;
          drinkButton.style.opacity = "0.5";
        }

        const amount = parseInt(amountInput.value || "200", 10);
        if (Number.isNaN(amount) || amount <= 0) {
          return;
        }

        this.user.addWater(amount);
        this.user.history.unshift({
          hora: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          cantidad: amount,
          timestamp: Math.floor(Date.now() / 1000)
        });

        saveUser(this.user);
        this.updateUI();
        amountInput.value = "";

        setTimeout(() => { // enabless the drink button back after timeout
          this.isDrinkButtonDisabled = false;
          if (drinkButton) {
            drinkButton.disabled = false;
            drinkButton.style.opacity = "1";
          }
        }, 1000);
      });
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
        this.navigation.showView("today");
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

  renderizarHistorial() {
    renderizarHistorial({
      user: this.user,
      dom: this.dom,
      onAfterChange: () => { // on element delete
        this.renderizarHistorial();
        this.updateUI();
      },
    });
  }

  renderizarPerfil() {
    renderizarPerfil({
      user: this.user,
      dom: this.dom,
    });
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
