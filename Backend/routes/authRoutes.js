const express = require("express");
const auth = require("../controllers/authController.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/login", auth.loginController);
router.post("/logout", auth.logoutController);
router.get("/user/:id", verifyToken, auth.userController);
router.get("/verify", verifyToken, (req, res) => {
  res.json({ message: "Acceso concedido", user: req.user });
});

router.get("/admins/list", verifyToken, auth.getAdmins);
router.put("/update/:id", verifyToken, auth.editAdmin);
router.post("/admin", verifyToken, auth.createAdminController);



module.exports = router;
