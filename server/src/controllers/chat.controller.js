import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Organization from "../models/Organization.js";
import Visitor from "../models/Visitor.js";
import { answerQuestion } from "../services/ragApi.service.js";

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

    return res.status(201).json({
      visitor: {
        id: visitor._id,
        name: visitor.name,
        email: visitor.email,
      },
      conversation: null,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getConversation(req, res, next) {
  try {
    const { conversationId } = req.params;
    const { visitorId } = req.query;

    if (!visitorId) {
      return res.status(400).json({ message: "visitorId is required" });
    }

    const organization = await findOrganization(req.params.slug);

    if (!organization) {
      return res.status(404).json({ message: "Chatbot not found" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      visitorId,
      organizationId: organization._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const visitor = await Visitor.findOne({
      _id: visitorId,
      organizationId: organization._id,
    });

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
      organizationId: organization._id,
    }).sort({ createdAt: 1 });

    return res.json({
      visitor: {
        id: visitor._id,
        name: visitor.name,
        email: visitor.email,
      },
      conversation: {
        id: conversation._id,
        status: conversation.status,
      },
      messages: messages.map((entry) => ({
        id: entry._id,
        sender: entry.sender,
        content: entry.content,
      })),
    });
  } catch (error) {
    return next(error);
  }
}

export async function listVisitorConversations(req, res, next) {
  try {
    const { visitorId } = req.params;
    const organization = await findOrganization(req.params.slug);

    if (!organization) {
      return res.status(404).json({ message: "Chatbot not found" });
    }

    const visitor = await Visitor.findOne({
      _id: visitorId,
      organizationId: organization._id,
    });

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    const conversations = await Conversation.find({
      organizationId: organization._id,
      visitorId,
    })
      .sort({ lastMessageAt: -1 })
      .limit(25);

    const hasVisitorMessageIds = new Set(
      (
        await Message.distinct("conversationId", {
          organizationId: organization._id,
          sender: "visitor",
          conversationId: { $in: conversations.map((c) => c._id) },
        })
      ).map((value) => value.toString()),
    );

    const enriched = await Promise.all(
      conversations
        .filter((conversation) => hasVisitorMessageIds.has(conversation._id.toString()))
        .map(async (conversation) => {
        const lastMessage = await Message.findOne({
          organizationId: organization._id,
          conversationId: conversation._id,
        }).sort({ createdAt: -1 });

        return {
          id: conversation._id,
          status: conversation.status,
          lastMessageAt: conversation.lastMessageAt,
          createdAt: conversation.createdAt,
          preview: lastMessage?.content ? String(lastMessage.content).slice(0, 140) : "",
        };
      }),
    );

    return res.json({
      visitor: { id: visitor._id, name: visitor.name, email: visitor.email },
      conversations: enriched,
    });
  } catch (error) {
    return next(error);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { conversationId, visitorId, message } = req.body;

    if (!visitorId || !message) {
      return res.status(400).json({
        message: "Visitor ID and message are required",
      });
    }

    const organization = await findOrganization(req.params.slug);

    if (!organization) {
      return res.status(404).json({ message: "Chatbot not found" });
    }

    const visitor = await Visitor.findOne({
      _id: visitorId,
      organizationId: organization._id,
    });

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    const conversation = conversationId
      ? await Conversation.findOne({
          _id: conversationId,
          visitorId,
          organizationId: organization._id,
          status: "active",
        })
      : await Conversation.create({
          organizationId: organization._id,
          visitorId: visitor._id,
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

    let replyText = "I could not find relevant information in this company's documents yet.";

    try {
      const { answer } = await answerQuestion({
        organizationId: organization._id,
        question: message,
        topK: 5,
      });

      if (answer) {
        replyText = answer;
      }
    } catch (ragError) {
      replyText =
        "I could not search the company documents right now. Please try again in a moment.";
      console.error("RAG answer failed:", ragError.response?.data || ragError.message);
    }

    const assistantMessage = await Message.create({
      organizationId: organization._id,
      conversationId: conversation._id,
      sender: "assistant",
      content: replyText,
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    return res.json({
      conversation: {
        id: conversation._id,
        status: conversation.status,
      },
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
