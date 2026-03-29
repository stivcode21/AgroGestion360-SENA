const express = require("express");
const consumption = require("../controllers/consumptionController");
const { verifyToken } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/activity/:id", verifyToken, consumption.getConsumptionByActivity);
router.post("/create", verifyToken, consumption.createConsumption);
router.put(
  "/activity/:id",
  verifyToken,
  consumption.updateConsumptionByActivity,
);

module.exports = router;
