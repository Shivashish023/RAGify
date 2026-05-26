import generateToken from "../utils/generateToken.js";
import createPublicKey from "../utils/createPublicKey.js";
import createSlug from "../utils/createSlug.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";

function createAuthResponse(user, organization) {
  const token = generateToken({
    userId: user._id.toString(),
    organizationId: user.organizationId.toString(),
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id,
      organizationId: user.organizationId,
      organizationName: organization.name,
      organizationSlug: organization.slug,
      publicChatbotKey: organization.publicChatbotKey,
      chatbotStatus: organization.chatbotStatus,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function register(req, res, next) {
  try {
    const { organizationName, name, email, password } = req.body;

    if (!organizationName || !name || !email || !password) {
      return res.status(400).json({
        message: "Organization name, name, email, and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    const baseSlug = createSlug(organizationName);
    const slug = baseSlug || `company-${Date.now()}`;
    const existingOrganization = await Organization.findOne({ slug });

    if (existingOrganization) {
      return res.status(409).json({
        message: "An organization with this name already exists. Try a more specific company name.",
      });
    }

    const organization = await Organization.create({
      name: organizationName,
      slug,
      publicChatbotKey: createPublicKey(),
    });

    const user = await User.create({
      organizationId: organization._id,
      name,
      email,
      password,
      role: "admin",
    });

    return res.status(201).json(createAuthResponse(user, organization));
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const organization = await Organization.findById(user.organizationId);

    if (!organization) {
      return res.status(401).json({ message: "Organization not found for this user" });
    }

    return res.json(createAuthResponse(user, organization));
  } catch (error) {
    return next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const organization = await Organization.findById(user.organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    return res.json({
      user: createAuthResponse(user, organization).user,
    });
  } catch (error) {
    return next(error);
  }
}
