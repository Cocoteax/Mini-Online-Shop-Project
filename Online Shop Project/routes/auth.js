const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

// /login => GET
router.get("/login", authController.getLogin);

// /login => POST
router.post("/login", authController.postLogin);

// /signup => GET
router.get("/signup", authController.getSignup);

// /signup => POST
router.post("/signup", authController.postSignup);

// /logout => POST
router.post("/logout", authController.postLogout);

module.exports = { router };
