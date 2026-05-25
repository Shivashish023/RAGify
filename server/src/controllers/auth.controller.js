import generateToken from "../utils/generateToken.js";

const demoUser = {
  id: "user_demo_admin",
  organizationId: "org_demo",
  organizationName: "RAGify Demo Workspace",
  name: "Demo Admin",
  email: "admin@ragify.dev",
  role: "admin",
};

export function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const token = generateToken({
    userId: demoUser.id,
    organizationId: demoUser.organizationId,
    role: demoUser.role,
  });

  return res.json({
    token,
    user: demoUser,
  });
}

export function me(req, res) {
  return res.json({
    user: {
      ...demoUser,
      id: req.user.userId,
      organizationId: req.user.organizationId,
      role: req.user.role,
    },
  });
}
