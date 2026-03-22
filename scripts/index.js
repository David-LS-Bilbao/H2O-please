import { loadCurrentUser } from "./core/storage.js";
import { login, register } from "./services/authService.js";

function initLoginPage() {
  const currentUser = loadCurrentUser(); //autologin
  if (currentUser) {
    window.location.href = "dashboard.html";
    return;
  }

  const authForm = document.querySelector("#auth-form");
  const tabs = document.querySelectorAll(".auth-tab");
  const submitBtn = document.querySelector("#auth-submit-btn");

  let mode = "login"; // default mode

  const message = document.createElement("p");
  message.id = "auth-message";
  message.setAttribute("role", "status");
  message.setAttribute("aria-live", "polite");
  document.querySelector("main").appendChild(message);

  function renderAuthMessage(text = "") {
    message.textContent = text;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      mode = tab.dataset.mode; // modes: login / register

      tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      if (mode === "login") {
        submitBtn.textContent = "Entrar";
        document.querySelector("#password").setAttribute("autocomplete", "current-password");
      } else {
        submitBtn.textContent = "Registrarse";
        document.querySelector("#password").setAttribute("autocomplete", "new-password");
      }

      renderAuthMessage("");
    });
  });

  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.querySelector("#username").value.trim();
      const password = document.querySelector("#password").value.trim();
      if (!username || !password) return;

      renderAuthMessage("");

      if (mode === "login") {
        const ok = login(username, password);
        if (ok) {
          window.location.href = "dashboard.html";
          return;
        }
        renderAuthMessage("Usuario y/o contraseña incorrectos");
      } else {
        const ok = register(username, password);
        if (ok) {
          window.location.href = "dashboard.html";
          return;
        }
        renderAuthMessage("El nombre de usuario ya existe");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initLoginPage);
