import jwt from "jsonwebtoken";
import env from "../config/env.js";

function generateToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export default generateToken;
