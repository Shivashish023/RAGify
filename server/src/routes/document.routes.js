import express from "express";
import { getDocuments, uploadDocument } from "../controllers/document.controller.js";
import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/", getDocuments);
router.post("/upload", upload.single("document"), uploadDocument);

export default router;
