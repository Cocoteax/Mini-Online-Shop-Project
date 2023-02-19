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
const cartItem = require("./models/cart-item");
const Order = require("./models/order");
const orderItem = require("./models/order-item");

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
  let user = await User.findByPk(1);
  req.user = user; // We can now access the current user in our controllers by accessing req.user (See admin and shop controller)
  next();
});

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

// User has a one-to-one r/s with Cart => Foreign key userId in Cart model
User.hasOne(Cart);
Cart.belongsTo(User);

// Cart has a many-to-many r/s with Product
// In a many-to-many r/s, SQL will create an intermediate table as a result of the r/s => Recall ER diagrams for many-to-many r/s, the relationship forms a table containing the primary keys of all participating entities
// In this case, sequelize creates the table defined in the through object => CartItem contains the PK of Cart and Product and represents the many-to-many r/s
Cart.belongsToMany(Product, { through: cartItem });
Product.belongsToMany(Cart, { through: cartItem });

// Order has a one-to-many r/s with User => Foreign key userId in Order model
Order.belongsTo(User);
User.hasMany(Order);

// Order has a many-to-many r/s with Product
Order.belongsToMany(Product, { through: orderItem });
Product.belongsToMany(Order, { through: orderItem });

// .sync() creates all models defined using sequelize.define() as a table in the database
// .sync() returns a promise, so we can use then/catch or async/await
// sequelize.sync();
//   .then((result) => {
//     // console.log(result);
//     app.listen(3000);
//   })
//   .catch((e) => console.log(e));
// app.listen(3000);

// ========== Using async/await ==========
(async () => {
  try {
    await sequelize.sync();
    // Temporary method for creating a user
    let user = await User.findByPk(1);
    if (user === null) {
      user = await User.create({
        name: "Max",
        email: "test@test.com",
      });
    }
    // Temporary method for creating a cart associated to the user
    const cart = await user.getCart();
    if (!cart) {
      await user.createCart(); // special mixin for one-to-one r/s to create a cart associated to the current user
    }
    app.listen(3000);
  } catch (e) {
    console.log(e);
  }
})();
