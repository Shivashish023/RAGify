import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Organization from "../models/Organization.js";
import Visitor from "../models/Visitor.js";

async function findOrganization(slug) {
  return Organization.findOne({ slug, chatbotStatus: "active" });
}

export async function startChat(req, res, next) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const organization = await findOrganization(req.params.slug);

    if (!organization) {
      return res.status(404).json({ message: "Chatbot not found" });
    }

    const visitor = await Visitor.findOneAndUpdate(
      { organizationId: organization._id, email },
      { organizationId: organization._id, name, email },
      { new: true, upsert: true, runValidators: true },
    );

    const conversation = await Conversation.create({
      organizationId: organization._id,
      visitorId: visitor._id,
    });

    return res.status(201).json({
      visitor: {
        id: visitor._id,
        name: visitor.name,
        email: visitor.email,
      },
      conversation: {
        id: conversation._id,
        status: conversation.status,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { conversationId, visitorId, message } = req.body;

    if (!conversationId || !visitorId || !message) {
      return res.status(400).json({
        message: "Conversation ID, visitor ID, and message are required",
      });
    }

    const organization = await findOrganization(req.params.slug);

    if (!organization) {
      return res.status(404).json({ message: "Chatbot not found" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      visitorId,
      organizationId: organization._id,
      status: "active",
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const visitorMessage = await Message.create({
      organizationId: organization._id,
      conversationId: conversation._id,
      sender: "visitor",
      content: message,
    });

    const replyText = "Thanks for your message. The AI knowledge base will be connected soon.";

    const assistantMessage = await Message.create({
      organizationId: organization._id,
      conversationId: conversation._id,
      sender: "assistant",
      content: replyText,
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    return res.json({
      visitorMessage: {
        id: visitorMessage._id,
        sender: visitorMessage.sender,
        content: visitorMessage.content,
      },
      assistantMessage: {
        id: assistantMessage._id,
        sender: assistantMessage.sender,
        content: assistantMessage.content,
      },
    });
  } catch (error) {
    return next(error);
  }
}
