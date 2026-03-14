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
  }

  removeWater(amount) {
    this.waterConsumed = Math.max(0, this.waterConsumed - amount);
  }
}

export default UserConsumption;
