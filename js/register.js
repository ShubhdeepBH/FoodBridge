/**
 * FoodBridge Registration Controller
 *
 * Manages user registration UI events, role selection tabs (Donor vs NGO),
 * client-side input validation, and asynchronous POST requests to the Express backend API.
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Asynchronous Fetch API with JSON request/response payloads
 * - Role-Based Access Control (RBAC): strictly restricting registration to 'donor' or 'ngo'
 * - Defensive UI: submit button disabling during in-flight requests
 * - Client-side validation complementing authoritative backend validation
 * - Graceful error handling (duplicate email 409, validation 400, offline network failures)
 * - Information security: omitting passwords and sensitive data from client logs
 */

(function () {
  "use strict";

  // State
  let selectedRole = "donor";

  // DOM Elements
  const donorTab = document.getElementById("donorTab");
  const ngoTab = document.getElementById("ngoTab");
  const tabIndicator = document.getElementById("tabIndicator");

  const registerFormContainer = document.getElementById("registerFormContainer");
  const registerForm = document.getElementById("registerForm");
  const registerName = document.getElementById("registerName");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const registerPhone = document.getElementById("registerPhone");
  const registerAddress = document.getElementById("registerAddress");
  const registerSubmitBtn = document.getElementById("registerSubmitBtn");

  const registerErrorBanner = document.getElementById("registerErrorBanner");
  const errorMessageText = document.getElementById("errorMessageText");

  const successCardContainer = document.getElementById("successCardContainer");
  const successWelcomeMsg = document.getElementById("successWelcomeMsg");
  const successUserEmail = document.getElementById("successUserEmail");
  const successUserRole = document.getElementById("successUserRole");

  /**
   * Initializes page event listeners and session check.
   */
  function init() {
    // Role selection tabs
    if (donorTab && ngoTab) {
      donorTab.addEventListener("click", () => switchTab("donor"));
      ngoTab.addEventListener("click", () => switchTab("ngo"));
    }

    // Form submit listener
    if (registerForm) {
      registerForm.addEventListener("submit", handleRegisterSubmit);
    }

    // If an active session already exists, redirect to dashboard
    if (typeof isLoggedIn === "function" && isLoggedIn()) {
      const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
      if (user && user.role) {
        window.location.replace(user.role + "-dashboard.html");
      }
    }
  }

  /**
   * Switches the active registration role between 'donor' and 'ngo'.
   * @param {string} role - 'donor' or 'ngo'
   */
  function switchTab(role) {
    if (role === "ngo") {
      selectedRole = "ngo";
      if (tabIndicator) tabIndicator.style.transform = "translateX(100%)";
      if (ngoTab) {
        ngoTab.classList.add("active");
        ngoTab.setAttribute("aria-selected", "true");
      }
      if (donorTab) {
        donorTab.classList.remove("active");
        donorTab.setAttribute("aria-selected", "false");
      }
    } else {
      selectedRole = "donor";
      if (tabIndicator) tabIndicator.style.transform = "translateX(0)";
      if (donorTab) {
        donorTab.classList.add("active");
        donorTab.setAttribute("aria-selected", "true");
      }
      if (ngoTab) {
        ngoTab.classList.remove("active");
        ngoTab.setAttribute("aria-selected", "false");
      }
    }
  }

  /**
   * Validates form input and submits registration data to the backend API.
   * @param {Event} event - Form submit event
   */
  async function handleRegisterSubmit(event) {
    event.preventDefault();
    hideError();

    const nameValue = registerName ? registerName.value.trim() : "";
    const emailValue = registerEmail ? registerEmail.value.trim() : "";
    const passwordValue = registerPassword ? registerPassword.value : "";
    const phoneValue = registerPhone ? registerPhone.value.trim() : "";
    const addressValue = registerAddress ? registerAddress.value.trim() : "";

    // 1. Client-side input validation
    if (!nameValue) {
      showError("Please enter your name or organization name.");
      if (registerName) registerName.focus();
      return;
    }

    if (!emailValue) {
      showError("Please enter your email address.");
      if (registerEmail) registerEmail.focus();
      return;
    }

    if (registerEmail && typeof registerEmail.checkValidity === "function" && !registerEmail.checkValidity()) {
      showError("Please provide a valid email address.");
      registerEmail.focus();
      return;
    }

    if (!passwordValue) {
      showError("Please enter a password.");
      if (registerPassword) registerPassword.focus();
      return;
    }

    if (passwordValue.length < 6) {
      showError("Password must be at least 6 characters.");
      if (registerPassword) registerPassword.focus();
      return;
    }

    // Restrict public registration role strictly to 'donor' or 'ngo'
    const roleToSend = selectedRole === "ngo" ? "ngo" : "donor";

    // Manage flight state on the submit button
    const submitBtn = registerSubmitBtn || (registerForm ? registerForm.querySelector('button[type="submit"]') : null);
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      // 2. Resolve the API base URL from auth.js or default
      const baseUrl = (typeof API_BASE_URL !== "undefined")
        ? API_BASE_URL
        : (typeof window !== "undefined" && window.API_BASE_URL)
          ? window.API_BASE_URL
          : "http://localhost:5000/api";

      // 3. Dispatch POST request to /auth/register
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: nameValue,
          email: emailValue,
          password: passwordValue,
          role: roleToSend,
          phone: phoneValue,
          address: addressValue
        })
      });

      // 4. Safely parse JSON payload
      let data = null;
      try {
        data = await response.json();
      } catch (parseError) {
        data = null;
      }

      // 5. Handle successful registration (HTTP 201 Created)
      if (response.status === 201) {
        const allowedRoles = ["donor", "ngo"];
        const user = data && typeof data.user === "object" ? data.user : null;
        const hasValidName = Boolean(user && typeof user.name === "string" && user.name.trim().length > 0);
        const hasValidEmail = Boolean(user && typeof user.email === "string" && user.email.trim().length > 0);
        const hasValidRole = Boolean(user && typeof user.role === "string" && allowedRoles.includes(user.role));

        if (hasValidName && hasValidEmail && hasValidRole) {
          showSuccessState(user);
          return;
        }

        // Incomplete or malformed HTTP 201 response fallback
        showError("Registration succeeded, but received an unexpected server response. Please try signing in.");
        return;
      }

      // 6. Handle backend validation errors (400) and duplicate email (409)
      if (data && data.message) {
        showError(data.message);
      } else if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        showError(data.errors.join(". "));
      } else {
        showError(`Registration failed with status ${response.status}. Please check your details.`);
      }

    } catch (error) {
      // 7. Handle network / offline errors gracefully without logging credentials
      console.error("Registration request error:", error.message || error);
      showError("Registration service is temporarily unavailable. Please make sure the server is running.");
    } finally {
      // 8. Always re-enable submit button
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  }

  /**
   * Renders the registration success container and hides the form.
   * Note: Does NOT store session or JWT token, requiring user to sign in.
   * @param {Object} user - Safe user object returned from backend
   */
  function showSuccessState(user) {
    if (!user) return;

    if (registerFormContainer) {
      registerFormContainer.style.display = "none";
    }

    if (successCardContainer) {
      successCardContainer.classList.add("visible");
    }

    if (successWelcomeMsg) {
      successWelcomeMsg.textContent = "Welcome, " + user.name + "!";
    }

    if (successUserEmail) {
      successUserEmail.textContent = user.email;
    }

    if (successUserRole) {
      successUserRole.textContent = user.role;
    }

    if (registerForm) {
      registerForm.reset();
    }
  }

  /**
   * Displays an error message in the error banner.
   * @param {string} message - Error text
   */
  function showError(message) {
    if (errorMessageText) {
      errorMessageText.textContent = message;
    }
    if (registerErrorBanner) {
      registerErrorBanner.classList.add("visible");
    }
  }

  /**
   * Hides the error banner.
   */
  function hideError() {
    if (registerErrorBanner) {
      registerErrorBanner.classList.remove("visible");
    }
  }

  // Load handler
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
