const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const BEARER_SCHEME = "Bearer";

function timingSafeStringEquals(value, expected) {
  const valueBuffer = Buffer.from(String(value || ""));
  const expectedBuffer = Buffer.from(expected);
  const comparableValue = Buffer.alloc(expectedBuffer.length);

  valueBuffer.copy(comparableValue, 0, 0, Math.min(valueBuffer.length, expectedBuffer.length));

  const isSameLength = valueBuffer.length === expectedBuffer.length;
  const isSameValue = crypto.timingSafeEqual(comparableValue, expectedBuffer);

  return isSameLength && isSameValue;
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (!timingSafeStringEquals(scheme, BEARER_SCHEME) || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret is not configured" });
      console.error("JWT secret is not configured");
      return res.status(500).json({ message: "Internal server error" });
    }
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { authenticate };
