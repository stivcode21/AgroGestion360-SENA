const express = require("express");
const products = require("../controllers/productController.js");

const router = express.Router();

// GET /product/6
router.get("/getproduct/:id", products.getProduct);

// GET /list/2
router.get("/list/:page", products.listProducts);

router.post("/register", products.createProduct);

// PUT /edit/2
router.put("/edit/:id", products.editProduct);

// DELETE /eliminar/2
router.delete("/delete/:id", products.deleteProduct);

module.exports = router;
