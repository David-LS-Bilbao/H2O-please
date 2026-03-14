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
    this.dom.renderInitialUI(this.user);
    this.attachListeners();
    this.updateUI();
  }

  attachListeners() {
    const { drinkForm, amountInput, btnToday, btnHistory, btnMe } = this.dom.elements;

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

    if (btnToday) {
      btnToday.addEventListener("click", () => this.cambiarPestana("today"));
    }

    if (btnHistory) {
      btnHistory.addEventListener("click", () => this.cambiarPestana("history"));
    }

    if (btnMe) {
      btnMe.addEventListener("click", () => this.cambiarPestana("me"));
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
      const item = document.createElement("div");
      item.style.cssText =
        "display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid #eee; align-items:center;";
      item.innerHTML = `
        <span style="font-weight:bold; color:#555;">${toma.hora}</span>
        <span style="color:#007bff; font-weight:bold;">+${toma.cantidad} ml</span>
      `;
      historyContainer.appendChild(item);
    });
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
