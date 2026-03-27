const express = require("express");
const request = require("../controllers/requestController.js");

const router = express.Router();

// GET /getrequest/6
router.get("/request/:id", request.getRequest);

router.get("/list", request.listRequests);

// POST /create
router.post("/create", request.postRequest);

// router.put("/edit/:id", request.editRequest);

// router.delete("/delete/:id", request.deleteRequest);

module.exports = router;
