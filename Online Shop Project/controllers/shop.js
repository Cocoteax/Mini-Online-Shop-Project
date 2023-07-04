// Controllers contain the (req,res,next) logic of the middleware
// product controller which manipulates data from the model and sends them to the view (MVC)
// The routes and http method define which controller code gets executed

// Get the classes from the model
const Product = require("../models/product");
// const Order = require("../models/order");

// / => GET
const getIndex = async (req, res, next) => {
  try {
    // Using defined .fetchAll() method from Product model
    const products = await Product.fetchAll();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (e) {
    console.log(e);
  }
};

// /products => GET
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (e) {
    console.log(e);
  }
};

// /products/:productID => GET
const getProductDetail = async (req, res, next) => {
  // use req.params.{dynamicVariable} to access the dynamic variable that we inserted into the URL
  // Note that the name of the dynamicVariable is the name we use to define the dynamic variable when we create the route (See shop.js routes)
  const productID = req.params.productID;
  try {
    const product = await Product.findById(productID);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (e) {
    console.log(e);
  }
};

// /cart => GET
const getCart = async (req, res, next) => {
  try {
    const cartProducts = await req.user.getCartItems();
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: cartProducts,
    });
  } catch (e) {
    console.log(e);
  }
};

// /cart => POST
const postCart = async (req, res, next) => {
  try {
    const productID = req.body.productID;
    const product = await Product.findById(productID);
    await req.user.addToCart(product);
    res.redirect("/cart");
  } catch (e) {
    console.log(e);
  }
};

// /cart-delete-item => POST
const deleteCartItem = async (req, res, next) => {
  const productID = req.body.productID;
  try {
    await req.user.deleteItemFromCart(productID);
    res.redirect("/cart");
  } catch (e) {
    console.log(e);
  }
};

// /orders => GET
const getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders();
    console.log(orders);
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (e) {
    console.log(e);
  }
};

// /create-order => POST
const postOrders = async (req, res, next) => {
  try {
    await req.user.addOrder();
    res.redirect("/orders");
  } catch (e) {
    console.log(e);
  }
};

// // // /checkout => GET
// // const getCheckout = (req, res, next) => {
// //   res.render("shop/checkout", {
// //     path: "/checkout",
// //     pageTitle: "Your Checkout Page",
// //   });
// // };

// export the controllers
module.exports = {
  getIndex,
  getProducts,
  getProductDetail,
  getCart,
  postCart,
  deleteCartItem,
  getOrders,
  postOrders,
};
