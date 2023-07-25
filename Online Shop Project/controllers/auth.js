const User = require("../models/user");

// Package to encrypt passwords
const bcrypt = require("bcryptjs");

// /login => GET
const getLogin = async (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

// /login => POST
const postLogin = async (req, res, next) => {
  //   // Set a client cookie for authentication status so that loggedIn status persists
  //   // NOTE: "Set-Cookie" is a reserved keyword for setting cookies via headers
  //   res.setHeader("Set-Cookie", "loggedIn = true; HttpOnly");

  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    // User does not exist
    if (!user) {
      console.log("Login failed");
      return res.redirect("/login");
    }
    // If user exists, check for valid password with bcrypt.compare()
    // NOTE: first arg is entered PW, second arg is hashed PW from db
    const validPassword = await bcrypt.compare(password, user.password);

    // Invalid PW
    if (!validPassword) {
      console.log("Invalid password");
      return res.redirect("/login");
    }
    // Valid password, set an authenticated session for the user so that loggedIn status persists across different requests (See admin.js and shop.js controllers)
    // NOTE: we use express-session cookies for security since cookies will be encrypted
    req.session.isLoggedIn = true;
    // NOTE: When we access the user through req.session.user, we are not fetching it through mongoose
    // Hence, it will only contain the raw user data and NOT the methods we defined on the user object
    // To access the actual user object methods, we have a separate middleware in app.js to store the actual user object into req.user (See app.js)
    req.session.user = user;
    // To ensure that the session is saved before executing the next line of code, we use .save()
    // The callback function will be executed once the session has been successsfully saved
    // If we don't use .save(), there may be a chance that we redirect before the session is saved and the user is not authenticated in the UI even though the backend is
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (e) {
    console.log(e);
  }
};

// /signup => GET
const getSignup = async (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

// /signup => POST
const postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.redirect("/signup");
    }

    // Encrypt password before storing
    // NOTE: first arg is entered PW, second arg is number of rounds to hash PW (12 is secure)
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();
    return res.redirect("/login");
  } catch (e) {
    console.log(e);
  }
};

// /logout => POST
const postLogout = async (req, res, next) => {
  // req.session.destroy() destroys the current session in the backend to log user out
  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { getLogin, postLogin, postLogout, getSignup, postSignup };
