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
          hora: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          cantidad: amount,
          timestamp: Math.floor(Date.now() / 1000)
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
        this.cambiarPestana("today");
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
        '<p style="text-align:center; padding:1rem;">No hay registros hoy.</p>';
      return;
    }

    let index = 0;
    // Cada movimiento se representa como una fila simple dentro del contenedor.
    this.user.history.forEach((toma) => {

      const amount = Number(toma.cantidad) || 0;
      const item = document.createElement("div");
      item.style.cssText =
        "display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid #eee; align-items:center;";
      item.innerHTML = `
        <span style="font-weight:bold; color:#555;">${toma.hora}</span>
        <span>+${amount} ml</span>`;
      const button = document.createElement("button");
      button.classList.add("trash-button");
      button.innerHTML = '<svg viewBox="0 0 512 512"><path d="M 253.26123 42.729492 C 244.03545 43.123047 234.89473 45.498047 226.71973 49.810547 C 210.87973 57.960547 198.71064 72.950176 194.16064 90.180176 C 192.64064 95.550176 192.38945 101.13941 191.68945 106.64941 C 156.46945 106.70941 121.22977 106.62992 86.009766 106.66992 C 79.379766 106.51992 72.78041 109.43064 68.67041 114.66064 C 63.79041 120.60064 62.63041 129.26957 65.67041 136.30957 C 68.58041 143.24957 75.399961 148.50938 82.959961 149.10938 C 90.829961 149.76937 98.740117 149.01037 106.62012 149.38037 C 106.73012 230.25037 106.62992 311.12977 106.66992 392.00977 C 106.72992 402.06977 106.02941 412.36014 108.89941 422.14014 C 114.79941 444.19014 133.33959 462.28928 155.57959 467.50928 C 164.84959 469.93928 174.51049 469.25008 184.00049 469.33008 C 236.66049 469.32008 289.3107 469.35982 341.9707 469.31982 C 360.2007 469.23982 378.10988 460.82064 389.87988 446.91064 C 399.64988 435.65064 405.22934 420.87973 405.31934 405.96973 C 405.38934 320.43973 405.25939 234.91037 405.37939 149.38037 C 413.24939 149.00037 421.14 149.79059 429 149.10059 C 437.09 148.45059 444.32963 142.53988 446.86963 134.87988 C 449.71963 126.75988 447.06986 117.07039 440.35986 111.65039 C 436.41986 108.20039 431.16975 106.64992 425.98975 106.66992 C 390.76975 106.63992 355.5298 106.69941 320.2998 106.64941 C 319.5898 100.33941 319.21039 93.919609 317.15039 87.849609 C 310.63039 66.249609 291.87002 48.859434 269.77002 44.169434 C 264.36252 42.969434 258.7967 42.493359 253.26123 42.729492 z M 256.00049 85.290527 C 267.20049 85.030527 277.93979 95.249414 277.02979 106.64941 C 263.00979 106.69941 248.98973 106.68941 234.96973 106.64941 C 234.02973 95.249414 244.82049 85.050527 256.00049 85.290527 z M 149.38037 149.38037 C 220.46037 149.30037 291.54061 149.31037 362.62061 149.38037 C 362.74061 231.91037 362.61066 314.46049 362.68066 397.00049 C 362.64066 402.87049 363.33053 409.13932 360.54053 414.54932 C 357.09053 421.92932 349.19957 426.82969 341.05957 426.67969 C 284.34957 426.65969 227.64994 426.65969 170.93994 426.67969 C 162.58994 426.80969 154.41939 421.59039 151.12939 413.90039 C 148.70939 408.61039 149.37031 402.65049 149.32031 397.00049 C 149.39031 314.46049 149.26037 231.92037 149.38037 149.38037 z M 299.04199 191.9209 C 297.48068 191.89494 295.90359 192.05945 294.33984 192.43945 C 284.78984 194.24945 277.31059 203.27 277.35059 213 C 277.32059 262.99 277.32059 313 277.35059 363 C 277.24059 374.03 286.96023 383.9007 297.99023 383.9707 C 309.44023 384.6607 320.08971 374.55031 319.94971 363.07031 C 320.02971 313.03031 320.02996 262.97994 319.95996 212.93994 C 320.15246 201.67869 309.97115 192.1026 299.04199 191.9209 z M 212.64404 191.99121 C 211.52834 192.02586 210.41256 192.15314 209.31006 192.37939 C 199.32006 194.14939 191.56 203.79043 192 213.94043 L 192 362.05957 C 191.67 370.82957 197.32045 379.29975 205.46045 382.48975 C 213.45045 385.80975 223.27029 383.46982 229.05029 377.06982 C 232.82029 373.03982 234.73969 367.52932 234.67969 362.04932 C 234.65969 315.36932 234.64969 268.68 234.67969 222 C 234.65969 215.63 235.38049 208.75002 232.00049 203.02002 C 228.29049 196.06377 220.45396 191.74867 212.64404 191.99121 z " /></svg>';
      button.dataset.id = index;

      button.addEventListener("click", () => {
        const thisButtonId = parseInt(button.dataset.id);
        this.user.addWater(-this.user.history[thisButtonId].cantidad);
        this.user.history.splice(thisButtonId, 1);

        if (this.user.history.length > 0) {
          const lastEntry = this.user.history[0];
          const nowUnix = Math.floor(Date.now() / 1000);
          this.user.lastTimeConsumedUnix = lastEntry.timestamp;
          this.user.nextAlarm = lastEntry.timestamp + 1800;
        } else {
          this.user.lastTimeConsumedUnix = null;
          this.user.nextAlarm = null;
        }

        saveUser(this.user);
        this.renderizarHistorial();
        this.updateUI();
      });

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
