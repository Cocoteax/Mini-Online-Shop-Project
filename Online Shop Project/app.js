const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");
const MONGODB_URI =
  "mongodb+srv://admin:admin123@cluster0.dnoygrc.mongodb.net/shop?";
const session = require("express-session"); // Package to handle sessions
const mongoDBStore = require("connect-mongodb-session")(session); // MongoDB package for storing sessions
// Configure the collection for saving sessions in mongodb
const store = new mongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

const User = require("./models/user");

// Registers an app-level middleware that parses incoming request data
// Note that this middleware will automatically call next() behind the scenes to go to subsequent middleware below
// Hence, we put it at the very top because we want to be able to parse all incoming request data from the below middleware
// data can be accessed through req.body (see admin.js controller)
app.use(bodyParser.urlencoded({ extended: false }));

// Register app-level middleware to handle sessions
// Refer to express-server documentation for the config object passed into session()
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store, // Define what store will be used to save the sessions (mongodb store in this case)
  })
);

// By default, express cannot access static files such as the CSS files within public folder
// Hence, we need to create an app-level middleware and call express.static to grant read access to static files in the public folder
// Whenever express tries to access a static file, it will execute this middleware and access the corresponding static file
// See views and note how we can link the css file to them because of this middleware
app.use(express.static(path.join(__dirname, "public")));

// Middleware to retrieve the actual mongoose user object with all its defined schema methods
// NOTE: If we access req.session.user, it will only contain the raw user data and not the methods of the user object
app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    // If there's an existing session user, then we store the user object with all its methods into req.user
    let user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

// // ========== Setting up app-level middlewares which execute the route-level middlewares based on the route specified ==========
// // The general execution pattern is:    App-level middleware > router-level middleware > controller code (Which executes model code and sends data to views)
// // Start by defining models > define app-level middleware and router-level middleware for the routing > define controllers for logic
app.use("/admin", adminRoutes.router);
app.use("/", shopRoutes.router); // If the router.get("/") has no exact match in shopRoutes, then it will execute the below middleware
app.use("/", authRoutes.router); // If the router.get("/") has no exact match in authRoutes, then it will execute the below middleware
app.use("/", errorController.get404);

// // ========== mongodb driver connection ========== //
// const startApp = async () => {
//   await mongoConnect();
//   app.listen(3000);
// };
// startApp();

// ========== mongoose connection ========== //
const startApp = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to mongodb!");
    app.listen(3000);
  } catch (e) {
    console.log(e);
  }
};
startApp();
