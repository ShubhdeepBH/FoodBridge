/**
 * FoodBridge Authentication Utilities
 * 
 * Provides helper functions for managing the current user session using sessionStorage,
 * storing JWT authentication tokens, and referencing the backend API base URL.
 * 
 * CA2 Syllabus Concepts Demonstrated:
 * - Session state management using browser sessionStorage
 * - JWT storage and retrieval for authenticated REST API requests
 * - API endpoint centralization
 * - Defense-in-depth: avoiding plaintext password / credential persistence
 */

// Backend API base URL for local development
const API_BASE_URL = "http://localhost:5000/api";
if (typeof window !== "undefined") {
  window.API_BASE_URL = API_BASE_URL;
} else if (typeof global !== "undefined") {
  global.API_BASE_URL = API_BASE_URL;
}

/**
 * Saves the authenticated user's profile and JWT token in sessionStorage.
 * NEVER stores the password or password hash for security.
 * Normalizes user ID to ensure backward compatibility across schemas.
 *
 * @param {Object} user - The safe user object from the backend API.
 * @param {string} [token] - The JSON Web Token returned by the backend.
 */
function saveCurrentUser(user, token) {
  if (!user) return;
  
  // Create a safe user object containing only public information
  // Normalize profile ID as id: user._id || user.id
  const safeUser = {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  // Preserve optional contact fields if present
  if (user.phone !== undefined) {
    safeUser.phone = user.phone;
  }
  if (user.address !== undefined) {
    safeUser.address = user.address;
  }
  
  sessionStorage.setItem("currentUser", JSON.stringify(safeUser));

  if (token && typeof token === "string") {
    sessionStorage.setItem("authToken", token);
  }
}

/**
 * Retrieves the authentication JWT token from sessionStorage.
 * @returns {string|null} The auth token or null if not found.
 */
function getAuthToken() {
  return sessionStorage.getItem("authToken");
}

/**
 * Retrieves the currently logged-in user from sessionStorage.
 * @returns {Object|null} The user object or null if not logged in.
 */
function getCurrentUser() {
  const userJson = sessionStorage.getItem("currentUser");
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error parsing current user from sessionStorage:", error);
    return null;
  }
}

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} True if logged in, false otherwise.
 */
function isLoggedIn() {
  return getCurrentUser() !== null;
}

/**
 * Clears the user session and authentication token, logging them out.
 */
function logoutUser() {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("authToken");
}
