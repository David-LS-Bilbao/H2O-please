document.addEventListener("DOMContentLoaded", () => {
  function loadDarkModeState() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return false;

    const userData = localStorage.getItem(`userConsumption:${currentUser}`);
    if (!userData) return false;

    const user = JSON.parse(userData);
    return user.darkModeEnabled ?? false;
  }

  const isDarkModeEnabled = loadDarkModeState();
  document.body.classList.toggle("dark-theme", isDarkModeEnabled);

  const toggleButton = document.getElementById("toggleButton");
  if (toggleButton) {
    toggleButton.checked = isDarkModeEnabled;
    toggleButton.addEventListener("change", () => {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) return;

      const userData = localStorage.getItem(`userConsumption:${currentUser}`);
      if (!userData) return;

      const user = JSON.parse(userData);
      user.darkModeEnabled = toggleButton.checked;
      localStorage.setItem(`userConsumption:${currentUser}`, JSON.stringify(user));

      document.body.classList.toggle("dark-theme", toggleButton.checked);
    });
  }
});
