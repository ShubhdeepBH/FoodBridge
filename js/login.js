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
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  
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
   * Validates form input and submits credentials to the Express backend API.
   * @param {Event} event - Form submit event
   */
  async function handleLoginSubmit(event) {
    event.preventDefault();
    hideError();

    const emailValue = loginEmail ? loginEmail.value.trim() : "";
    const passwordValue = loginPassword ? loginPassword.value.trim() : "";

    // 1. Validation for empty inputs
    if (emailValue === "" || passwordValue === "") {
      showError("Please fill out both email and password fields.");
      return;
    }

    // Determine the submit button to manage flight state
    const submitBtn = loginSubmitBtn || (loginForm ? loginForm.querySelector('button[type="submit"]') : null);

    // Disable the submit button while request is in flight to prevent duplicate submissions
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      // 2. Resolve the API base URL from auth.js or fallback to default
      const baseUrl = (typeof API_BASE_URL !== "undefined")
        ? API_BASE_URL
        : (typeof window !== "undefined" && window.API_BASE_URL)
          ? window.API_BASE_URL
          : "http://localhost:5000/api";

      // 3. Send POST request to /auth/login with credentials
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue
        })
      });

      // 4. Safely parse JSON response
      let data = null;
      try {
        data = await response.json();
      } catch (parseError) {
        data = null;
      }

      // 5. Handle successful authentication (HTTP 200 OK)
      if (response.ok) {
        const allowedRoles = ["donor", "ngo", "admin"];
        const hasValidUser = Boolean(data && typeof data.user === "object" && data.user !== null);
        const hasValidToken = Boolean(data && typeof data.token === "string" && data.token.trim().length > 0);
        const hasValidRole = Boolean(hasValidUser && typeof data.user.role === "string" && allowedRoles.includes(data.user.role));

        if (hasValidUser && hasValidToken && hasValidRole) {
          // Save safe user info and JWT token to sessionStorage
          if (typeof saveCurrentUser === "function") {
            saveCurrentUser(data.user, data.token);
          }

          // Redirect to the role-specific dashboard
          window.location.replace(`${data.user.role}-dashboard.html`);
          return;
        }

        // Response succeeded (HTTP 200) but missing required token, user, or valid role
        showError("Authentication failed due to an invalid server response. Please try again.");
        return;
      }

      // 6. Handle backend failure responses (e.g. 401 Unauthorized, 400 Bad Request)
      const errorMsg = (data && data.message)
        ? data.message
        : "Invalid email or password. Please try again.";
      showError(errorMsg);

    } catch (error) {
      // 7. Handle network or server offline errors gracefully without logging credentials
      console.error("Login request error:", error.message || error);
      showError("Authentication service is temporarily unavailable. Please make sure the server is running.");
    } finally {
      // 8. Re-enable the submit button regardless of success or failure
      if (submitBtn) {
        submitBtn.disabled = false;
      }
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
