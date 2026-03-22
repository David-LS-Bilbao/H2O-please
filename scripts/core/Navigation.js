class Navigation {
  constructor() {
    this.views = {
      today: document.querySelector("#view-today"),
      history: document.querySelector("#view-history"),
      me: document.querySelector("#view-me"),
    };
    this.buttons = {
      today: document.querySelector("#btn-today"),
      history: document.querySelector("#btn-history"),
      me: document.querySelector("#btn-me"),
    };
    this.viewCallbacks = {
      today: null,
      history: null,
      me: null,
    };
  }

  init() {
    this.buttons.today?.addEventListener("click", () => this.showView("today"));
    this.buttons.history?.addEventListener("click", () => this.showView("history"));
    this.buttons.me?.addEventListener("click", () => this.showView("me"));
  }

  onViewChange(viewName, callback) {
    this.viewCallbacks[viewName] = callback;
  }

  showView(viewName) {
    Object.values(this.views).forEach(view => {
      if (view) view.style.display = "none";
    });
    if (this.views[viewName]) {
      this.views[viewName].style.display = "flex";
      if (this.viewCallbacks[viewName]) {
        this.viewCallbacks[viewName]();
      }
    }
  }
}

export default Navigation;
