const express = require("express");
const request = require("../controllers/requestController.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

const router = express.Router();

// GET /getrequest/6
router.get("/request/:id", verifyToken, request.getRequest);

router.get("/list", verifyToken, request.listRequests);

// POST /create
router.post("/create", verifyToken, request.postRequest);

router.put("/edit/:id", verifyToken, request.editRequest);

router.delete("/delete/:id", verifyToken, request.deleteRequest);

module.exports = router;
