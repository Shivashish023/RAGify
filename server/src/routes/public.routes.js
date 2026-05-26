import express from "express";
import { getPublicOrganization } from "../controllers/public.controller.js";

const router = express.Router();

router.get("/organizations/:slug", getPublicOrganization);

export default router;
