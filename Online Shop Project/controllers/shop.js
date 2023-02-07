// Controllers contain the (req,res,next) logic of the middleware
// product controller which manipulates data from the model and sends them to the view (MVC)
// The routes and http method define which controller code gets executed

// Get the classes from the model
const Product = require("../models/product");
const Cart = require("../models/cart");

// / => GET
const getIndex = async (req, res, next) => {
  // ========== Using async/await ==========
  try {
    const products = await Product.fetchAll(); // fetchAll() returns a promise (See product.js Model)
    res.render("shop/index", {
      prods: products[0],
      pageTitle: "Shop",
      path: "/",
    });
    console.log(products[0]);
  } catch (e) {
    console.log(e);
  }

  // ========== Using then/catch ==========
  // Product.fetchAll()
  //   .then((result) => {
  //     res.render("shop/index", {
  //       prods: result[0],
  //       pageTitle: "Shop",
  //       path: "/",
  //     });
  //     console.log(result[0]);
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });
};

// /products => GET
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/product-list", {
      prods: products[0],
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
      product: product[0][0],
      pageTitle: product.title,
      path: "/products",
    });
  } catch (e) {
    console.log(e);
  }
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
