// Middleware to check if user is authenticated before we grant access to a route
const isAuthenticated = async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

const is = async (req, res, next) => {
  next();
};

module.exports = isAuthenticated;
