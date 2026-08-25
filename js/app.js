(function () {
  "use strict";

  const appState = {
    initializedAt: new Date().toISOString(),
    currentView: "landing",
  };

  function initAppShell() {
    document.documentElement.dataset.app = "foodbridge";
    document.documentElement.dataset.view = appState.currentView;
  }

  function init() {
    initAppShell();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
