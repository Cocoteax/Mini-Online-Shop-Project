// Controllers contain the (req,res,next) logic of the middleware
// product controller which manipulates data from the model and sends them to the view (MVC)
// The routes and http method define which controller code gets executed

// Get the classes from the model
const Product = require("../models/product");
const Cart = require("../models/cart");

// / => GET
const getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

// /products => GET
const getProducts = (req, res, next) => {
  // Call fetchAll() static method without instantiating a Product object
  // Note how a callback function is passed to fetchAll(), but is not executed straight away. It will only be executed if it is called within fetchAll()
  // Hence, the products argument will be determined when this callback function is executed within fetchAll() (See products.js model)
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

// /products/:productID => GET
const getProductDetail = (req, res, next) => {
  // use req.params.{dynamicVariable} to access the dynamic variable that we inserted into the URL
  // Note that the name of the dynamicVariable is the name we use to define the dynamic variable when we create the route (See shop.js routes)
  const productID = req.params.productID;
  // Note how a callback function is passed to findById() as the second argument, but is not executed straight away. It will only be executed if it is called within findById()
  // Hence, the product argument will be determined when this callback function is executed within findById() (See products.js model)
  Product.findById(productID, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

// /cart => GET
const getCart = (req, res, next) => {
  // Get all products in the cart and in the product model
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        // If a product from the Product model exists in the cart, then we add the product and its qty into cartProductData
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty }); // Note how qty is taken from the cart
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

// /cart => POST
const postCart = (req, res, next) => {
  const productID = req.body.productID;
  Product.findById(productID, (product) => {
    Cart.addProduct(productID, product.price);
  });
  res.redirect("/cart");
};

// /cart-delete-item => POST
const deleteCartItem = (req, res, next) => {
  const productID = req.body.productID;
  Product.findById(productID, (product) => {
    Cart.deleteProduct(productID, product.price);
    res.redirect("/");
  });
};

// /orders => GET
const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

// /checkout => GET
const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Your Checkout Page",
  });
};

// export the controllers
module.exports = {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProductDetail,
  postCart,
  deleteCartItem,
};
