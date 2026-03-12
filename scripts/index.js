import { login, register } from "./services/authService.js";

function initLoginPage() {
  const loginForm = document.querySelector("#login-form");
  const registerForm = document.querySelector("#register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.querySelector("#username").value.trim();
      if (!username) return;

      const ok = login(username);
      if (ok) window.location.href = "dashboard.html";
      else alert("Usuario no encontrado");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.querySelector("#new-username").value.trim();
      if (!username) return;

      register(username);
      window.location.href = "dashboard.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", initLoginPage);