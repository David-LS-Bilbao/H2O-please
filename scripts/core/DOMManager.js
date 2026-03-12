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
    };
  }

  renderInitialUI(user) {
    const { totalText, dailyTarget, progress, countdown } = this.elements;

    if (totalText) totalText.textContent = `${user.waterConsumed} ml`;
    if (dailyTarget) dailyTarget.textContent = `${user.consumptionTarget} ml`;
    if (progress) progress.value = Math.min(
      100,
      Math.round((user.waterConsumed / user.consumptionTarget) * 100)
    );
    if (countdown) countdown.textContent = "00:00"; // or calculated if needed
  }
}

export default DOMManager;