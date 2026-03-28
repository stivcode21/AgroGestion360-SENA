const express = require("express");
const products = require("../controllers/productController.js");
const { verifyToken } = require("../middleware/authMiddleware.js");

const router = express.Router();

// GET /product/6
router.get("/getproduct/:id", verifyToken, products.getProduct);

// GET /list/2
router.get("/list/:page", verifyToken, products.listProducts);

router.post("/register", verifyToken, products.postProduct);

// PUT /edit/2
router.put("/edit/:id", verifyToken, products.editProduct);

// DELETE /eliminar/2
router.delete("/delete/:id", verifyToken, products.deleteProduct);

//GET /filter/1?tipo=2&orden=recientes
router.get("/filter/:page", verifyToken, products.filterProductsPaginated);

module.exports = router;
