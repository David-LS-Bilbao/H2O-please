import DOMManager from "./DOMManager.js";
import { loadCurrentUser, saveUser } from "./storage.js";

function unixToTime(unixSeconds) {
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleTimeString("es-ES", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseOptionalPositiveInteger(rawValue) {
  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

class App {
  constructor() {
    this.dom = new DOMManager();
    this.user = null;
  }

  init() {
    this.user = loadCurrentUser();
    if (!this.user) {
      window.location.href = "index.html";
      return;
    }

    if (!Array.isArray(this.user.history)) {
      this.user.history = [];
    }

    this.dom.cacheElements();
    this.verificarNuevoDia();
    this.dom.renderInitialUI(this.user);
    this.attachListeners();
    this.updateUI();
  }

  verificarNuevoDia() {
    const hoy = new Date().toLocaleDateString("es-ES");

    if (!this.user.lastDate) {
      this.user.lastDate = hoy;
      saveUser(this.user);
      return;
    }

    if (this.user.lastDate !== hoy) {
      this.user.waterConsumed = 0;
      this.user.history = [];
      this.user.lastDate = hoy;
      saveUser(this.user);
    }
  }

  attachListeners() {
    const {
      drinkForm,
      amountInput,
      removeButton,
      btnToday,
      btnHistory,
      btnMe,
      editAge,
      editWeight,
      btnSaveProfile,
      btnLogout,
    } = this.dom.elements;

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

    if (removeButton) {
      removeButton.addEventListener("click", (e) => {
        e.preventDefault();
        const amount = parseInt(amountInput.value || "200", 10);
        if (Number.isNaN(amount) || amount <= 0) {
          return;
        }

        const removedAmount = Math.min(amount, this.user.waterConsumed);
        if (removedAmount <= 0) {
          return;
        }

        this.user.removeWater(removedAmount);
        this.user.history.unshift({
          hora: new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          cantidad: -removedAmount,
        });

        saveUser(this.user);
        this.updateUI();
        amountInput.value = "";
      });
    }

    if (btnToday) {
      btnToday.addEventListener("click", () => this.cambiarPestana("today"));
    }

    if (btnHistory) {
      btnHistory.addEventListener("click", () => this.cambiarPestana("history"));
    }

    if (btnMe) {
      btnMe.addEventListener("click", () => this.cambiarPestana("me"));
    }

    if (btnSaveProfile) {
      // La persistencia de YO sigue la feature de Marcos, adaptada al modelo actual de esta rama.
      btnSaveProfile.addEventListener("click", () => {
        this.user.age = parseOptionalPositiveInteger(editAge?.value ?? "");
        this.user.weight = parseOptionalPositiveInteger(editWeight?.value ?? "");
        this.user.calculateTarget();
        saveUser(this.user);
        this.renderizarPerfil();
        this.updateUI();
      });
    }

    if (btnLogout) {
      // Se conserva el logout de YO por compatibilidad funcional con la feature original de Marcos.
      btnLogout.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
      });
    }
  }

  cambiarPestana(pestana) {
    const { viewToday, viewHistory, viewMe } = this.dom.elements;

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

  renderizarHistorial() {
    const { historyContainer } = this.dom.elements;
    if (!historyContainer) {
      return;
    }

    historyContainer.innerHTML = "";

    if (!Array.isArray(this.user.history) || this.user.history.length === 0) {
      historyContainer.innerHTML =
        '<p style="text-align:center; padding:20px;">No hay registros hoy.</p>';
      return;
    }

    this.user.history.forEach((toma) => {
      const amount = Number(toma.cantidad) || 0;
      const isNegative = amount < 0;
      const item = document.createElement("div");
      item.style.cssText =
        "display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid #eee; align-items:center;";
      item.innerHTML = `
        <span style="font-weight:bold; color:#555;">${toma.hora}</span>
        <span style="color:${isNegative ? "#b42318" : "#007bff"}; font-weight:bold;">${isNegative ? "" : "+"}${amount} ml</span>
      `;
      historyContainer.appendChild(item);
    });
  }

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

  updateUI() {
    const { totalText, countdown, progress, dailyTarget } = this.dom.elements;

    if (totalText) {
      totalText.textContent = `${this.user.waterConsumed}`;
    }

    if (countdown) {
      if (this.user.lastTimeConsumedUnix && this.user.nextAlarm) {
        countdown.textContent = `Próximo vaso: ${unixToTime(this.user.nextAlarm)} horas`;
        countdown.style.opacity = "1";
      } else {
        countdown.textContent = "00:00";
        countdown.style.opacity = "0";
      }
    }

    const percent = Math.min(
      100,
      Math.round((this.user.waterConsumed / this.user.consumptionTarget) * 100)
    );

    if (progress) {
      progress.value = percent;
    }

    if (dailyTarget) {
      dailyTarget.textContent = `${this.user.consumptionTarget}`;
    }
  }
}

export default App;
