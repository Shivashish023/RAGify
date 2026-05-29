import Document from "../models/Document.js";
import { uploadBufferToCloudinary } from "../services/cloudinary.service.js";

const mimeToFileType = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "text/plain": "txt",
};

const fileTypeToMime = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain; charset=utf-8",
};

export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Document file is required" });
    }

    const fileType = mimeToFileType[req.file.mimetype];

    if (!fileType) {
      return res.status(400).json({ message: "Only PDF, DOCX, and TXT files are allowed" });
    }

    const uploadResult = await uploadBufferToCloudinary(req.file, req.user.organizationId);

    const document = await Document.create({
      organizationId: req.user.organizationId,
      uploadedBy: req.user.userId,
      originalName: req.file.originalname,
      fileType,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      status: "uploaded",
    });

    return res.status(201).json({ document });
  } catch (error) {
    return next(error);
  }
}

export async function getDocuments(req, res, next) {
  try {
    const documents = await Document.find({
      organizationId: req.user.organizationId,
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.json({ documents });
  } catch (error) {
    return next(error);
  }
}

export async function getDocumentFile(req, res, next) {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const fileResponse = await fetch(document.cloudinaryUrl);

    if (!fileResponse.ok) {
      return res.status(502).json({ message: "Unable to fetch document file" });
    }

    const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());
    const disposition = req.query.download === "true" ? "attachment" : "inline";
    const safeFileName = document.originalName.replace(/["\r\n]/g, "");

    res.setHeader("Content-Type", fileTypeToMime[document.fileType] || "application/octet-stream");
    res.setHeader("Content-Disposition", `${disposition}; filename="${safeFileName}"`);
    res.setHeader("Content-Length", fileBuffer.length);

    return res.send(fileBuffer);
  } catch (error) {
    return next(error);
  }
}
