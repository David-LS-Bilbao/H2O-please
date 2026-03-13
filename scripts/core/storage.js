import UserConsumption from "../models/UserConsumption.js";

const STORAGE_KEY_PREFIX = "userConsumption:";

export function saveUser(user) {
  const key = STORAGE_KEY_PREFIX + user.username;
  const raw = {
    username: user.username,
    lastTimeConsumed: user.lastTimeConsumed,
    lastTimeConsumedUnix: user.lastTimeConsumedUnix,
    nextAlarm: user.nextAlarm,
    waterConsumed: user.waterConsumed,
    consumptionTarget: user.consumptionTarget,
    history: user.history
  };
  localStorage.setItem(key, JSON.stringify(raw));
}

export function loadUser(username) {
  const raw = localStorage.getItem(STORAGE_KEY_PREFIX + username);
  if (!raw) return null;
  const data = JSON.parse(raw);
  return new UserConsumption(username, data);
}

export function userExists(username) {
  const raw = localStorage.getItem(STORAGE_KEY_PREFIX + username);
  if (raw) return true;
  return false
}

export function loadCurrentUser() {
  const username = localStorage.getItem("currentUser");
  if (!username) return null;
  return loadUser(username);
}