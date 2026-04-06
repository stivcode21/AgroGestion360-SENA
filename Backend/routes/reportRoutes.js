const express = require("express");
const report = require("../controllers/reportController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/inventory", verifyToken, report.getInventoryReport);
router.get("/payroll", verifyToken, report.getPayrollReport);

module.exports = router;
