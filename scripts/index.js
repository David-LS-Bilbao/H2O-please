import { loadCurrentUser } from "./core/storage.js";
import { login, register } from "./services/authService.js";

function initLoginPage() {
  // Integracion  revisable: autologin en index manteniendo el flujo de redireccion actual del proyecto.
  const currentUser = loadCurrentUser();
  if (currentUser) {
    window.location.href = "dashboard.html";
    return;
  }

  const loginForm = document.querySelector("#login-form");
  const registerForm = document.querySelector("#register-form");
  const message= document.createElement("p");
  message.id = "auth-message";
  message.setAttribute("role", "status");
  message.setAttribute("aria-live", "polite");
  document.querySelector("main").appendChild(message);
  const authMessage = document.querySelector("#auth-message");

  function renderAuthMessage(message = "") {
    if (!authMessage) {
      return;
    }

    authMessage.textContent = message;
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Integracion  revisable: se recuperan usuario y password usando el contenedor de mensajes ya integrado en dev.
      const username = document.querySelector("#username").value.trim();
      const password = document.querySelector("#password").value.trim();
      if (!username || !password) return;

      renderAuthMessage("");
      const ok = login(username, password);
      if (ok) {
        window.location.href = "dashboard.html";
        return;
      }
      loginForm.appendChild(message);
      renderAuthMessage("Usuario y/o contrasena incorrectos.");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Integracion  revisable: se anade password al registro sin sustituir la mensajeria ya integrada.
      const username = document.querySelector("#new-username").value.trim();
      const password = document.querySelector("#new-password").value.trim();
      if (!username || !password) return;

      renderAuthMessage("");
      const ok = register(username, password);
      if (ok) {
        window.location.href = "dashboard.html";
        return;
      }
      registerForm.appendChild(message);
      renderAuthMessage("El usuario ya existe.");
    });
  }
}

document.addEventListener("DOMContentLoaded", initLoginPage);
