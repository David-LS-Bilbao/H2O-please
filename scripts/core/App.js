import DOMManager from "./DOMManager.js";
import { loadCurrentUser, saveUser } from "./storage.js";

function unixToTime(unixSeconds) {
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleTimeString("es-ES", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
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

    this.dom.cacheElements();
    this.dom.renderInitialUI(this.user);
    this.attachListeners();
  }

  attachListeners() {
    const { drinkButton, amountInput, removeButton } = this.dom.elements;

    if (drinkButton) {
      drinkButton.addEventListener("click", (e) => {
        e.preventDefault();
        const amount = parseInt(amountInput.value || "200", 10);
        if (Number.isNaN(amount) || amount <= 0) return;

        this.user.addWater(amount);
        saveUser(this.user);
        this.updateUI();
      });
    }

    if (removeButton) {
      removeButton.addEventListener("click", (e) => {
        e.preventDefault();
        const amount = parseInt(amountInput.value || "200", 10);
        if (Number.isNaN(amount) || amount <= 0) return;

        this.user.removeWater(amount);
        saveUser(this.user);
        this.updateUI();
      });
    }

  }

  updateUI() {
    const { totalText, countdown, progress, dailyTarget } = this.dom.elements;

    totalText.textContent = `${this.user.waterConsumed}`;  /* ELIMINO ml */


    if (this.user.lastTimeConsumedUnix) {
      countdown.textContent =
        `Siguiente toma a las ${unixToTime(this.user.nextAlarm)}`;
    }

    const percent = Math.min(
      100,
      Math.round((this.user.waterConsumed / this.user.consumptionTarget) * 100)
    );
    progress.value = percent;

    dailyTarget.textContent = `${this.user.consumptionTarget}`; /* ELIMINO ml */
  }
}

export default App;