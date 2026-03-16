class UserConsumption {
  constructor(username, data = {}) {
    this.username = username;
    this.lastTimeConsumed = data.lastTimeConsumed || null;
    this.lastTimeConsumedUnix = data.lastTimeConsumedUnix || null;
    this.nextAlarm = data.nextAlarm || null;
    this.waterConsumed = data.waterConsumed ?? 0;
    this.consumptionTarget = data.consumptionTarget ?? 2300;
    this.lastDate = data.lastDate || new Date().toLocaleDateString();
    this.history = data.history || []; 
    this.age = data.age || 0;        
    this.weight = data.weight || 0;   
  }

  calculateTarget() {
    if (this.weight > 0) {
      this.consumptionTarget = this.weight * 35;
    }
  }

  addWater(amount) {
    const nowUnix = Math.floor(Date.now() / 1000);
    this.lastTimeConsumedUnix = nowUnix;
    this.lastTimeConsumed = new Date();
    this.waterConsumed += amount;
    this.nextAlarm = nowUnix + 1800;
  }
}

export default UserConsumption;