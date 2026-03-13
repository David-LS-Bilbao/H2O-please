class DOMManager {
  constructor() {
    this.elements = {};
  }

  cacheElements() {
    this.elements = {
      appLayout: document.querySelector(".app-layout"),
      progress: document.querySelector("#progress"),
      totalText: document.querySelector("#total"),
      dailyTarget: document.querySelector("#daily-target"),
      countdown: document.querySelector("#countdown"),
      drinkForm: document.querySelector("#drink-form"),
      amountInput: document.querySelector("#amount"),
      drinkButton: document.querySelector("#add-btn"),
      weatherOutput: document.querySelector("#weather-output"),

      // --- NUEVOS ELEMENTOS PARA NAVEGACIÓN Y VISTAS ---
      viewToday: document.querySelector("#view-today"),
      viewHistory: document.querySelector("#view-history"),
      viewMe: document.querySelector("#view-me"),

      btnToday: document.querySelector("#btn-today"),
      btnHistory: document.querySelector("#btn-history"),
      btnMe: document.querySelector("#btn-me"),

      // Contenedor donde se pintarán las filas del historial
      historyContainer: document.querySelector("#history-container"),
    };
  }

  renderInitialUI(user) {
    const { totalText, dailyTarget, progress, countdown } = this.elements;

    if (totalText) totalText.textContent = `${user.waterConsumed} ml`;
    if (dailyTarget) dailyTarget.textContent = `${user.consumptionTarget} ml`;
    
    if (progress) {
      const percent = Math.round((user.waterConsumed / user.consumptionTarget) * 100);
      progress.value = Math.min(100, percent);
    }
    
    if (countdown) countdown.textContent = "00:00";
  }
}

export default DOMManager;