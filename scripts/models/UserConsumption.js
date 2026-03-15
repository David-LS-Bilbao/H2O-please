class UserConsumption {
  // Integracion Jon adaptada y revisable: el modelo soporta password sin perder la estructura estable ya usada por App.
  constructor(username, password = null, data = {}) {
    this.username = username;
    this.password = password;
    this.lastTimeConsumed = data.lastTimeConsumed || null;
    this.lastTimeConsumedUnix = data.lastTimeConsumedUnix || null;
    this.nextAlarm = data.nextAlarm || null;
    this.waterConsumed = data.waterConsumed ?? 0;
    this.consumptionTarget = data.consumptionTarget ?? 2300;
    this.history = Array.isArray(data.history) ? data.history : [];
    this.lastDate = data.lastDate || null;
  }

  addWater(amount) {
    const nowUnix = Math.floor(Date.now() / 1000);
    this.lastTimeConsumedUnix = nowUnix;
    this.lastTimeConsumed = new Date();
    this.waterConsumed += amount;
    this.nextAlarm = nowUnix + 1800;
  }

  removeWater(amount) {
    this.waterConsumed = Math.max(0, this.waterConsumed - amount);
  }
}

export default UserConsumption;
