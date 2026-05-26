import jwt from "jsonwebtoken";

function protect(req, res, next) {
  const header = req.headers.authorization;
  const jwtSecret = process.env.JWT_SECRET || "ragify-dev-secret";

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default protect;
