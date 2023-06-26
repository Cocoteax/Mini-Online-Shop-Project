const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;

// Registers an app-level middleware that parses incoming request data
// Note that this middleware will automatically call next() behind the scenes to go to subsequent middleware below
// Hence, we put it at the very top because we want to be able to parse all incoming request data from the below middleware
// data can be accessed through req.body (see admin.js controller)
app.use(bodyParser.urlencoded({ extended: false }));

// By default, express cannot access static files such as the CSS files within public folder
// Hence, we need to create an app-level middleware and call express.static to grant read access to static files in the public folder
// Whenever express tries to access a static file, it will execute this middleware and access the corresponding static file
// See views and note how we can link the css file to them because of this middleware
app.use(express.static(path.join(__dirname, "public")));

// Temporary middleware to retrieve the user and store it into req.user and move to the next middleware
// Note that we can store current user in an authentication middleware in the future
app.use(async (req, res, next) => {
  // let user = await User.findByPk(1);
  // req.user = user; // We can now access the current user in our controllers by accessing req.user (See admin and shop controller)
  next();
});

// // ========== Setting up app-level middlewares which execute the route-level middlewares based on the route specified ==========
// // The general execution pattern is:    App-level middleware > router-level middleware > controller code (Which executes model code and sends data to views)
// // Start by defining models > define app-level middleware and router-level middleware for the routing > define controllers for logic
app.use("/admin", adminRoutes.router);
app.use("/", shopRoutes.router); // If the router.get("/") has no exact match, then it will execute the below 404 middleware
app.use("/", errorController.get404);

mongoConnect();
app.listen(3000);
