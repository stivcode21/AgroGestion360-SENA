const express = require("express");
const statistics = require("../controllers/statisticsController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard-cards", verifyToken, statistics.getDashboardCardsStats);

module.exports = router;
