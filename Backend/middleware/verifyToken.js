const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    console.log("🔹 Middleware Reached: Verifying Token...");

    const authHeader = req.headers.authorization;
    console.log("🔹 Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No valid token provided");
        return res.status(401).json({ error: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔹 Extracted Token:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token Verified:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error);
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};

module.exports = verifyToken;
