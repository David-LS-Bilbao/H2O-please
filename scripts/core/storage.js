import UserConsumption from "../models/UserConsumption.js";

const STORAGE_KEY_PREFIX = "userConsumption:";

export function saveUser(user) {
  const key = STORAGE_KEY_PREFIX + user.username;

  // Integracion Jon revisable: se persiste password junto al resto del estado del usuario.
  const raw = {
    username: user.username,
    password: user.password,
    lastTimeConsumed: user.lastTimeConsumed,
    lastTimeConsumedUnix: user.lastTimeConsumedUnix,
    nextAlarm: user.nextAlarm,
    waterConsumed: user.waterConsumed,
    consumptionTarget: user.consumptionTarget,
    history: user.history,
    lastDate: user.lastDate,
  };
  localStorage.setItem(key, JSON.stringify(raw));
}

export function loadUser(username) {
  const raw = localStorage.getItem(STORAGE_KEY_PREFIX + username);
  if (!raw) return null;

  // Integracion Jon adaptada y revisable: se reconstruye el modelo con password, manteniendo compatibilidad con usuarios existentes.
  const data = JSON.parse(raw);
  return new UserConsumption(data.username, data.password ?? null, data);
}

export function loadCurrentUser() {
  const username = localStorage.getItem("currentUser");
  if (!username) return null;
  return loadUser(username);
}
