const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const prisma = new PrismaClient();

const fileController = require("../controllers/fileController");

router.get("/", fileController.renderUploadFileForm);
router.post("/", upload.single("uploaded_file"), fileController.uploadFile);

router.get("/:id", fileController.showFileInfo);

module.exports = router;
