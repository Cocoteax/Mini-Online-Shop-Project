const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const isAuthenticated = require("../middleware/is-auth");

const router = express.Router();

// ========== Setting up route-level middleware using express Router which executes controller code based on specific routes ==========
// .get() is usually for rendering views using the controller
// .post() is for submitting data on a view using the controller

// /admin/add-product => GET
// NOTE: We can add as many controllers as we want, the request will parse through and be executed from left to right in order
// NOTE: We added a isAuthenticated middleware for route protection to ensure that users cannot manually navigate to the route without being authenticated
router.get("/add-product", isAuthenticated, adminController.getAddProductPage);

// /admin/add-product => POST
router.post("/add-product", isAuthenticated, adminController.postAddProduct);

// // /admin/products => GET
router.get("/products", isAuthenticated, adminController.getAdminProducts);

// // /admin/edit-product/{productID}?edit=value => GET (Using query params and dynamic routing)
router.get(
  "/edit-product/:productID",
  isAuthenticated,
  adminController.getEditProduct
);

// // /admin/edit-product => POST
router.post("/edit-product", isAuthenticated, adminController.postEditProduct);

// // /admin/delete-product => POST
router.post(
  "/delete-product",
  isAuthenticated,
  adminController.postDeleteProduct
);

module.exports = { router };
