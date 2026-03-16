import { loadUser, saveUser } from "../core/storage.js";
import UserConsumption from "../models/UserConsumption.js";

export function login(username, password) {
  const user = loadUser(username);

  // Integracion Jon adaptada y revisable: se valida password y se migra de forma compatible a usuarios legacy sin password.
  if (!user) {
    return false;
  }

  if (!user.password) {
    user.password = password;
    saveUser(user);
  } else if (user.password !== password) {
    return false;
  }

  localStorage.setItem("currentUser", username);
  return true;
}

export function register(username, password) {
  const existingUser = loadUser(username);
  if (existingUser) {
    return false;
  }

  // Integracion Jon revisable: el alta ya crea usuarios con password persistible desde el primer guardado.
  const user = new UserConsumption(username, password);
  saveUser(user);
  localStorage.setItem("currentUser", username);
  return true;
}
