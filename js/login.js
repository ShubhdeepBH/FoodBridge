/**
 * FoodBridge Login Controller
 * 
 * Manages the login UI events, tab selectors, validation checks,
 * and fetch requests to authenticate against the mock credentials.
 */

(function () {
  "use strict";

  // DOM Elements
  const donorTab = document.getElementById("donorTab");
  const ngoTab = document.getElementById("ngoTab");
  const tabIndicator = document.getElementById("tabIndicator");
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  
  const loginFormContainer = document.getElementById("loginFormContainer");
  const successCardContainer = document.getElementById("successCardContainer");
  const successWelcomeMsg = document.getElementById("successWelcomeMsg");
  const successUserEmail = document.getElementById("successUserEmail");
  const successUserRole = document.getElementById("successUserRole");
  const successLogoutBtn = document.getElementById("successLogoutBtn");

  const loginErrorBanner = document.getElementById("loginErrorBanner");
  const errorMessageText = document.getElementById("errorMessageText");

  /**
   * Initializes the login page state, checking if the user is already logged in.
   */
  function init() {
    // Tab switching event listeners (Visual layout effect only)
    if (donorTab && ngoTab) {
      donorTab.addEventListener("click", () => switchTab("donor"));
      ngoTab.addEventListener("click", () => switchTab("ngo"));
    }

    // Submit handler
    if (loginForm) {
      loginForm.addEventListener("submit", handleLoginSubmit);
    }

    // Logout handler
    if (successLogoutBtn) {
      successLogoutBtn.addEventListener("click", handleLogout);
    }

    // Check if user session already exists and redirect
    if (typeof isLoggedIn === "function" && isLoggedIn()) {
      const user = getCurrentUser();
      if (user && user.role) {
        window.location.replace(user.role + "-dashboard.html");
      }
    }
  }

  /**
   * Visually switches the tabs between Donor and NGO.
   * Note: This does not affect user authentication; roles are set by users.json data.
   * @param {string} role - 'donor' or 'ngo'
   */
  function switchTab(role) {
    if (role === "ngo") {
      tabIndicator.style.transform = "translateX(100%)";
      ngoTab.classList.add("active");
      ngoTab.setAttribute("aria-selected", "true");
      donorTab.classList.remove("active");
      donorTab.setAttribute("aria-selected", "false");
    } else {
      tabIndicator.style.transform = "translateX(0)";
      donorTab.classList.add("active");
      donorTab.setAttribute("aria-selected", "true");
      ngoTab.classList.remove("active");
      ngoTab.setAttribute("aria-selected", "false");
    }
  }

  /**
   * Validates form input and fetches credentials for authentication.
   * @param {Event} event - Form submit event
   */
  async function handleLoginSubmit(event) {
    event.preventDefault();
    hideError();

    const emailValue = loginEmail.value.trim();
    const passwordValue = loginPassword.value.trim();

    // 1. Validation for empty inputs
    if (emailValue === "" || passwordValue === "") {
      showError("Please fill out both email and password fields.");
      return;
    }

    try {
      // 2. Fetch the mock credentials database using async/await and Fetch API
      const response = await fetch("data/users.json");

      if (!response.ok) {
        throw new Error(`Failed to fetch user database: HTTP status ${response.status}`);
      }

      const users = await response.json();

      // 3. Find matching user via Array method
      const matchedUser = users.find(function (user) {
        return user.email === emailValue && user.password === passwordValue;
      });

      if (matchedUser) {
        // 4. Save safe user info to sessionStorage
        if (typeof saveCurrentUser === "function") {
          saveCurrentUser(matchedUser);
        }
        
        // 5. Redirect to the correct role-based dashboard
        window.location.replace(matchedUser.role + "-dashboard.html");
      } else {
        showError("Invalid email or password. Please try again.");
      }

    } catch (error) {
      console.error("Login verification error:", error);
      showError("Authentication service is temporarily unavailable. (" + error.message + ")");
    }
  }

  /**
   * Renders the logged in UI container, hiding the input form.
   * @param {Object} user - The current logged in user profile.
   */
  function showSuccessState(user) {
    if (!user) return;

    loginFormContainer.style.display = "none";
    successCardContainer.classList.add("visible");
    
    // Set dynamic elements on success view
    successWelcomeMsg.textContent = "Welcome back, " + user.name + "!";
    successUserEmail.textContent = user.email;
    successUserRole.textContent = user.role;
  }

  /**
   * Logs out the user and restores the default form display.
   */
  function handleLogout() {
    if (typeof logoutUser === "function") {
      logoutUser();
    }

    // Reset view container display
    successCardContainer.classList.remove("visible");
    loginFormContainer.style.display = "block";

    // Clear inputs
    if (loginForm) {
      loginForm.reset();
    }
    hideError();
  }

  /**
   * Helper to display validation and system alert messages.
   * @param {string} message - Error details text.
   */
  function showError(message) {
    errorMessageText.textContent = message;
    loginErrorBanner.classList.add("visible");
  }

  /**
   * Helper to hide error alerts.
   */
  function hideError() {
    loginErrorBanner.classList.remove("visible");
  }

  // Load handler
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
