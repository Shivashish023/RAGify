import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Visitor from "../models/Visitor.js";

export async function getDashboardStats(req, res, next) {
  try {
    const organizationId = req.user.organizationId;

    const [totalVisitors, totalConversations, totalMessages] = await Promise.all([
      Visitor.countDocuments({ organizationId }),
      Conversation.countDocuments({ organizationId }),
      Message.countDocuments({ organizationId }),
    ]);

    return res.json({
      totalVisitors,
      totalConversations,
      totalMessages,
    });
  } catch (error) {
    return next(error);
  }
}
