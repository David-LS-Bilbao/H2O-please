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
    this.attachNavigation();
    this.showView("today");
    this.updateUI();
  }

  attachListeners() {
    const { drinkForm, amountInput, removeButton } = this.dom.elements;

    if (drinkForm) {
      drinkForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const amount = parseInt(amountInput.value || "200", 10);
        if (Number.isNaN(amount) || amount <= 0) return;

        this.user.addWater(amount);
        saveUser(this.user);
        this.updateUI();
        drinkForm.reset();
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

  attachNavigation() {
    const { todayButton, historyButton, meButton } = this.dom.elements;

    if (todayButton) {
      todayButton.addEventListener("click", () => this.showView("today"));
    }

    if (historyButton) {
      historyButton.addEventListener("click", () => this.showView("history"));
    }

    if (meButton) {
      meButton.addEventListener("click", () => this.showView("me"));
    }
  }

  showView(viewName) {
    const { viewToday, viewHistory, viewMe } = this.dom.elements;
    const views = {
      today: viewToday,
      history: viewHistory,
      me: viewMe,
    };

    Object.values(views).forEach((view) => {
      if (view) view.style.display = "none";
    });

    if (views[viewName]) {
      views[viewName].style.display = "block";
    }

    if (viewName === "history") {
      this.renderHistory();
    }
  }

  updateUI() {
    const { totalText, countdown, progress, dailyTarget } = this.dom.elements;

    totalText.textContent = `${this.user.waterConsumed} ml`;

    if (this.user.lastTimeConsumedUnix) {
      countdown.textContent =
        `Siguiente toma a las ${unixToTime(this.user.nextAlarm)}`;
    }

    const percent = Math.min(
      100,
      Math.round((this.user.waterConsumed / this.user.consumptionTarget) * 100)
    );
    progress.value = percent;
    dailyTarget.textContent = `${this.user.consumptionTarget} ml`;
    this.renderHistory();
  }

  renderHistory() {
    const { historyContainer } = this.dom.elements;
    if (!historyContainer) return;

    historyContainer.innerHTML = "";

    if (!Array.isArray(this.user.history) || this.user.history.length === 0) {
      historyContainer.innerHTML = "<p>Aun no has registrado tomas hoy.</p>";
      return;
    }

    this.user.history.forEach((entry) => {
      const item = document.createElement("div");
      item.className = "history-entry";

      const time = document.createElement("span");
      time.textContent = entry.hora;

      const amount = document.createElement("span");
      amount.textContent = `+${entry.cantidad} ml`;

      item.append(time, amount);
      historyContainer.appendChild(item);
    });
  }
}

export default App;
