const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// ========== Setting up route-level middleware using express Router which executes controller code based on specific routes ==========
// .get() is usually for rendering views using the controller
// .post() is for submitting data on a view using the controller

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProductPage);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// // /admin/products => GET
router.get("/products", adminController.getAdminProducts);

// // /admin/edit-product/{productID}?edit=value => GET (Using query params and dynamic routing)
router.get("/edit-product/:productID", adminController.getEditProduct);

// // /admin/edit-product => POST
router.post("/edit-product", adminController.postEditProduct);

// // /admin/delete-product => POST
// router.post("/delete-product", adminController.postDeleteProduct);

module.exports = { router };
