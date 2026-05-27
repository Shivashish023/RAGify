import express from "express";
import { sendMessage, startChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/:slug/start", startChat);
router.post("/:slug/message", sendMessage);

export default router;
