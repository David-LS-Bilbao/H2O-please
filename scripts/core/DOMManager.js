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
      removeButton: document.querySelector("#remove-btn"),
      weatherOutput: document.querySelector("#weather-output"),
      viewToday: document.querySelector("#view-today"),
      viewHistory: document.querySelector("#view-history"),
      viewMe: document.querySelector("#view-me"),
      btnToday: document.querySelector("#btn-today"),
      btnHistory: document.querySelector("#btn-history"),
      btnMe: document.querySelector("#btn-me"),
      historyContainer: document.querySelector("#history-container"),
      // YO mantiene los mismos hooks de Marcos para reducir reinterpretaciones en futuros merges.
      profileName: document.querySelector("#profile-name"),
      profileTarget: document.querySelector("#profile-target"),
      editAge: document.querySelector("#edit-age"),
      editWeight: document.querySelector("#edit-weight"),
      btnSaveProfile: document.querySelector("#btn-save-profile"),
      btnLogout: document.querySelector("#btn-logout"),
    };
  }

  renderInitialUI(user) {
    const { totalText, dailyTarget, progress, countdown } = this.elements;

    if (totalText) {
      totalText.textContent = `${user.waterConsumed}`;
    }

    if (dailyTarget) {
      dailyTarget.textContent = `${user.consumptionTarget}`;
    }

    if (progress) {
      const percent = Math.round((user.waterConsumed / user.consumptionTarget) * 100);
      progress.value = Math.min(100, percent);
    }

    if (countdown) {
      countdown.textContent = "00:00";
    }
  }
}

export default DOMManager;
