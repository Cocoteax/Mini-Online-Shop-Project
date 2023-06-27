// Controllers contain the (req,res,next) logic of the middleware
// product controller which manipulates data from the model and sends them to the view (MVC)
// The routes and http method define which controller code gets executed

// Get the classes from the model
const Product = require("../models/product");
// const Cart = require("../models/cart");
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

// // /cart => GET
// const getCart = async (req, res, next) => {
//   try {
//     const cart = await req.user.getCart(); // special mixin for one-to-one relationship to get cart associated with current user
//     const cartProducts = await cart.getProducts(); // special mixin for many-to-many relationship to get products associated with cart of current user through the intermediate table
//     res.render("shop/cart", {
//       path: "/cart",
//       pageTitle: "Your Cart",
//       products: cartProducts,
//     });
//   } catch (e) {
//     console.log(e);
//   }
// };

// // /cart => POST
// const postCart = async (req, res, next) => {
//   try {
//     const productID = req.body.productID;
//     const cart = await req.user.getCart();
//     const cartProducts = await cart.getProducts({ where: { id: productID } }); // cartProducts is an array containing the desired product if present
//     // function to update product and quantity within the cart
//     const manageProductAndQty = async () => {
//       // If product already exists inside cart
//       if (cartProducts.length > 0) {
//         const product = cartProducts[0];
//         const oldQty = product.cartItem.quantity; // sequelize allows us to access the actual record from the intermediate model using dot notation
//         const qty = oldQty + 1;
//         return { product, qty };
//       }
//       // Else, if product does not exist inside cart
//       else {
//         const product = await Product.findByPk(productID);
//         const qty = 1;
//         return { product, qty };
//       }
//     };

//     // Call function to get updated product and quantity within the cart
//     const { product, qty } = await manageProductAndQty(); // Note the use of object destructuring

//     // Save the record into db using special mixin for many-to-many r/s
//     // Note that we pass in the second object to include the extra quantity field that we defined for the intermediate table
//     await cart.addProducts(product, { through: { quantity: qty } });
//     res.redirect("/cart");
//   } catch (e) {
//     console.log(e);
//   }
// };

// // /cart-delete-item => POST
// const deleteCartItem = async (req, res, next) => {
//   const productID = req.body.productID;
//   try {
//     const cart = await req.user.getCart();
//     const cartProduct = await cart.getProducts({ where: { id: productID } });
//     const product = cartProduct[0];
//     // Remove the product record ONLY from the cart-item intermediate model and not from the actual products table
//     // .cartItem is a special way of accessing the product record in the intermediate table that sequelize allows us to do
//     await product.cartItem.destroy();
//     res.redirect("/cart");
//   } catch (e) {
//     console.log(e);
//   }
// };

// // /orders => GET
// const getOrders = async (req, res, next) => {
//   try {
//     const orders = await req.user.getOrders({include: ['products']}); // Get the products from Product model related to the order by passing in include
//     res.render("shop/orders", {
//       path: "/orders",
//       pageTitle: "Your Orders",
//       orders: orders,
//     });
//   } catch (e) {
//     console.log(e);
//   }
// };

// // /create-order => POST
// const postOrders = async (req, res, next) => {
//   try {
//     const cart = await req.user.getCart();
//     const cartProducts = await cart.getProducts();
//     // Create an order using the current cartProducts associated to the user
//     const newOrder = await req.user.createOrder();

//     // Add the products from the cartProducts array into the intermediate orderItem model
//     // Note how we have to use .map() to iterate through the cartProducts array, add the individual qty attribute into each product, and store them as records in the intermediate orderitem table
//     // This is how we add multiple records at once even if they have different attribute values
//     await newOrder.addProducts(
//       cartProducts.map((product) => {
//         product.orderItem = { quantity: product.cartItem.quantity }; // Access each record in the intermediate table using the table name (orderItem) and assign the relevant qty attribute to the record
//         return product;
//       })
//     );

//     // Empty the cart after order has been created
//     await cart.setProducts(null);
//     res.redirect("/orders");
//   } catch (e) {
//     console.log(e);
//   }
// };

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
  // getCart,
  // getOrders,
  // postOrders,

  // postCart,
  // deleteCartItem,
};
