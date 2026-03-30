const express = require("express");
const image = require("../controllers/ImageController");
const { verifyToken } = require("../middleware/authMiddleware");
const { uploadSingleImage } = require("../middleware/uploadImage");

const router = express.Router();

router.post("/upload", verifyToken, uploadSingleImage, image.uploadImage);

module.exports = router;
