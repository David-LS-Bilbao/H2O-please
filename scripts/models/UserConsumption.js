class UserConsumption {
  constructor(username, data = {}) {
    this.username = username;
    this.lastTimeConsumed = data.lastTimeConsumed || null;
    this.lastTimeConsumedUnix = data.lastTimeConsumedUnix || null;
    this.nextAlarm = data.nextAlarm || null;
    this.waterConsumed = data.waterConsumed ?? 0;
    this.consumptionTarget = data.consumptionTarget ?? 2300;
    this.history = Array.isArray(data.history) ? data.history : [];
  }

  addWater(amount) {
    const nowUnix = Math.floor(Date.now() / 1000);
    this.lastTimeConsumedUnix = nowUnix;
    this.lastTimeConsumed = new Date();
    this.waterConsumed += amount;
    this.nextAlarm = nowUnix + 1800;
    // El historial se centraliza en el modelo para no duplicar entradas desde App.
    this.history.unshift(this.createHistoryEntry(amount));
  }

  removeWater(amount) {
    const removedAmount = Math.min(this.waterConsumed, amount);

    if (removedAmount <= 0) {
      return;
    }

    this.waterConsumed -= removedAmount;
    // Guardamos la correccion como valor negativo para reflejarla en historial.
    this.history.unshift(this.createHistoryEntry(-removedAmount));
  }

  createHistoryEntry(amount) {
    return {
      hora: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      cantidad: amount,
    };
  }
}

export default UserConsumption;
