  const jwt = require("jsonwebtoken");

  const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

     

    // Expect header: Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
       if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
      req.admin = decoded; // optional: attach admin info
      next(); // move to next middleware or route
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

  module.exports = verifyToken;
