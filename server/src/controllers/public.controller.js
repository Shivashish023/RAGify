import Organization from "../models/Organization.js";

export async function getPublicOrganization(req, res, next) {
  try {
    const organization = await Organization.findOne({
      slug: req.params.slug,
      chatbotStatus: "active",
    }).select("name slug chatbotStatus publicChatbotKey");

    if (!organization) {
      return res.status(404).json({ message: "Chatbot not found" });
    }

    return res.json({
      organization: {
        name: organization.name,
        slug: organization.slug,
        chatbotStatus: organization.chatbotStatus,
        publicChatbotKey: organization.publicChatbotKey,
      },
    });
  } catch (error) {
    return next(error);
  }
}
