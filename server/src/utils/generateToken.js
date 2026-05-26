import jwt from "jsonwebtoken";

function generateToken(payload) {
  const jwtSecret = process.env.JWT_SECRET || "ragify-dev-secret";
  return jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
}

export default generateToken;
