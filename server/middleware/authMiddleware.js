/**
 * FoodBridge - Authentication Middleware
 *
 * CA2 Syllabus Concepts Demonstrated:
 * - Custom Express middleware pattern (req, res, next)
 * - JSON Web Token (JWT) verification and payload decoding
 * - HTTP Authorization header Bearer token parsing
 * - Standardized 401 Unauthorized handling for unauthenticated requests
 * - Request object decoration (attaching decoded user ID and role to req.user)
 * - Safe error handling avoiding token or secret leakage in logs
 */

const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate incoming requests via JWT Bearer tokens.
 * Verifies the token signature and expiration against JWT_SECRET,
 * and attaches verified user credentials (id, role) to req.user.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verify Authorization header existence and Bearer scheme prefix
  if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access denied. No valid token provided"
    });
  }

  // 2. Extract token string following 'Bearer ' prefix
  const token = authHeader.split(" ")[1];

  if (!token || !token.trim()) {
    return res.status(401).json({
      message: "Access denied. Token missing"
    });
  }

  // 3. Verify that JWT_SECRET is configured in environment
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is missing from server environment");
    return res.status(500).json({
      message: "Authentication service misconfigured. Please contact administrator."
    });
  }

  // 4. Verify token validity and expiration
  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Verify expected payload attributes, non-empty ID string, and allowed role
    const validRoles = ["donor", "ngo", "admin"];
    if (
      !decoded ||
      typeof decoded !== "object" ||
      Array.isArray(decoded) ||
      typeof decoded.id !== "string" ||
      !decoded.id.trim() ||
      !validRoles.includes(decoded.role)
    ) {
      return res.status(401).json({
        message: "Authentication failed. Invalid token payload"
      });
    }

    // Attach verified user data to request object for downstream controllers
    req.user = {
      id: decoded.id.trim(),
      role: decoded.role
    };

    next();
  } catch (error) {
    // Distinguish token expiration from general token invalidity while returning 401
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Authentication failed. Token has expired"
      });
    }

    // Handles malformed, tampered, or invalid signature tokens
    return res.status(401).json({
      message: "Authentication failed. Invalid token"
    });
  }
};

module.exports = {
  protect
};
