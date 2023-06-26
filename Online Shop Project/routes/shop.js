const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

// ========== Setting up route-level middleware using Express Router which executes controller code based on specific routes ==========
// .get() is usually for rendering views using the controller
// .post() is for submitting data on a view using the controller

// / => GET
router.get("/", shopController.getIndex);

// /products => GET
router.get("/products", shopController.getProducts);

// // /products/{productID} => GET (Dynamic routing which accepts the productID dynamically)
// // By using :, express will know that the route should look for a dynamic variable
// // Note that the order matters, so if we have a /products/delete route below this route, then it will never reach /products/delete
// router.get("/products/:productID", shopController.getProductDetail);

// // /cart => GET
// router.get("/cart", shopController.getCart);

// // /cart => POST
// router.post("/cart", shopController.postCart);

// // /cart-delete-item => POST
// router.post("/cart-delete-item", shopController.deleteCartItem);

// // /orders => GET
// router.get("/orders", shopController.getOrders);

// // /create-order => POST
// router.post("/create-order", shopController.postOrders);

// // // /checkout => GET
// // router.get("/checkout", shopController.getCheckout);

module.exports = { router };
