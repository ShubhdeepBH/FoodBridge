/**
 * FoodBridge Authentication Utilities
 * 
 * Provides helper functions for managing the current user session using sessionStorage.
 * 
 * NOTE FOR EVALUATION:
 * This is a frontend-only demo authentication mechanism for the first assessment.
 * Real authentication, password hashing, and backend verification will be
 * implemented during the second evaluation using the MERN stack (Node, Express, MongoDB, JWT, bcrypt).
 */

/**
 * Saves the authenticated user's profile in sessionStorage.
 * NEVER stores the password for security.
 * @param {Object} user - The user object from the database.
 */
function saveCurrentUser(user) {
  if (!user) return;
  
  // Create a safe user object containing only public information
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  
  sessionStorage.setItem("currentUser", JSON.stringify(safeUser));
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
 * Clears the user session, logging them out.
 */
function logoutUser() {
  sessionStorage.removeItem("currentUser");
}
