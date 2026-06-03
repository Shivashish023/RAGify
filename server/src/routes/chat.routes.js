import express from "express";
import {
  getConversation,
  listVisitorConversations,
  sendMessage,
  startChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:slug/visitors/:visitorId/conversations", listVisitorConversations);
router.get("/:slug/conversations/:conversationId", getConversation);
router.post("/:slug/start", startChat);
router.post("/:slug/message", sendMessage);

export default router;
