const User = require("../models/user");

const getLogin = async (req, res, next) => {
  //   // Get current client cookies from header to determine the authentication status
  //   let isAuthenticated;
  //   const cookieString = req.get("Cookie");
  //   if (cookieString) {
  //     const cookieArray = cookieString.split(";");
  //     cookieArray.forEach((cookie) => {
  //       if (cookie.includes("loggedIn")) {
  //         isLoggedIn = cookie.split("=")[1];
  //         isAuthenticated = isLoggedIn === "true"; // Compare the string "true" to "true" to get boolean true value
  //       }
  //     });
  //   }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

const postLogin = async (req, res, next) => {
  //   // Set a client cookie for authentication status so that loggedIn status persists
  //   // NOTE: "Set-Cookie" is a reserved keyword for setting cookies via headers
  //   res.setHeader("Set-Cookie", "loggedIn = true; HttpOnly");

  // Set a session cookie for authentication status so that loggedIn status persists in this session
  // NOTE: If we check the session cookie on browser, it will be encrypted. Hence, it's better to use express-session cookies for security
  // NOTE: By setting a session cookie, we can access it across different requests (See admin.js and shop.js controllers)
  try {
    req.session.isLoggedIn = true;
    let user = await User.findById("64a7b9ae3e4ca28ae30a48c2");
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

const postLogout = async (req, res, next) => {
  // req.session.destroy() destroys the current session in the backend to log user out
  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { getLogin, postLogin, postLogout };
