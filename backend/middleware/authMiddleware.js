// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  // 🔐 Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // ✅ Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // 🔍 Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure userId is present in token payload
    if (!decoded.userId) {
      return res.status(401).json({ error: "Invalid token payload: userId missing" });
    }

    // 💾 Attach decoded user data to request
    req.user = { userId: decoded.userId };

    next(); // 🚀 Continue to the next middleware or route handler
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
