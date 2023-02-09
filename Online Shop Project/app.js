const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const Cart = require("./models/cart");
const User = require("./models/user");

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

// ========== Setting up app-level middlewares which execute the route-level middlewares based on the route specified ==========
// The general execution pattern is:    App-level middleware > router-level middleware > controller code (Which executes model code and sends data to views)
// Start by defining models > define app-level middleware and router-level middleware for the routing > define controllers for logic
app.use("/admin", adminRoutes.router);
app.use("/", shopRoutes.router); // If the router.get("/") has no exact match, then it will execute the below 404 middleware
app.use("/", errorController.get404);

// ========== Define relationship between models ========== (REFER TO DOCS FOR DIFFERENT TYPES OF ASSOCIATION AND HOW TO DEFINE RELATIONSHIPS)

// Products have one-to-many r/s with Users => Products have one User, but User can have multiple Product
// This creates a foreign key userId in Product model
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); // Second argument is a config object
User.hasMany(Product);

// Creates all models defined using sequelize.define() as a table in the database
// .sync() returns a promise, so we can use then/catch or async/await
sequelize.sync({ force: true });
//   .then((result) => {
//     // console.log(result);
//     app.listen(3000);
//   })
//   .catch((e) => console.log(e));
app.listen(3000);

// ========== Using async/await ==========
// (async () => {
//   try {
//     await sequelize.sync();
//     app.listen(3000);
//   } catch (e) {
//     console.log(e);
//   }
// })();
