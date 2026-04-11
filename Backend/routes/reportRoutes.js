const express = require("express");
const report = require("../controllers/reportController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/inventory", verifyToken, report.getInventoryReport);
router.get("/payroll", verifyToken, report.getPayrollReport);
router.get("/cattle-sales", verifyToken, report.getCattleSalesReport);
router.get(
  "/activity-payment-invoice/:idActividad",
  verifyToken,
  report.getActivityPaymentInvoice,
);

module.exports = router;
