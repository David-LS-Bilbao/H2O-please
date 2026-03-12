import { loadUser, saveUser } from "../core/storage.js";
import UserConsumption from "../models/UserConsumption.js";

export function login(username) {
  const user = loadUser(username);
  if (!user) return false;
  // Optionally set "current user" in localStorage
  localStorage.setItem("currentUser", username);
  return true;
}

export function register(username) {
  let user = new UserConsumption(username);
  saveUser(user);
  localStorage.setItem("currentUser", username);
}