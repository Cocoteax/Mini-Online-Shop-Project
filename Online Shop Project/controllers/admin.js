// Controllers contain the (req,res,next) logic of the middleware
// I.e., admin controller which manipulates data from the model and sends them to the view (MVC)
// The routes and http method define which controller code gets executed

// Get the Product class from the model
const Product = require("../models/product");

const mongodb = require("mongodb");

// /admin/add-product => GET
const getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

// /admin/add-product => POST
const postAddProduct = async (req, res, next) => {
  // ========== mongoose method ========== //
  // req.body gives us access to the POST request data (See bodyParser in app.js)
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;
  // To create a product document with mongoose, we pass in an object that maps the data to the fields of the schema
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageURL: imageURL,
  });
  try {
    await product.save(); // .save() is a method provided by mongoose to save a document
    res.redirect("/admin/products");
  } catch (e) {
    console.log(e);
  }

  //   // ========== mongodb driver method ========== //
  //   // req.body gives us access to the POST request data (See bodyParser in app.js)
  //   const title = req.body.title;
  //   const imageURL = req.body.imageURL;
  //   const price = req.body.price;
  //   const description = req.body.description;
  //   console.log(req.user._id);
  //   console.log(typeof req.user._id);
  //   const product = new Product(
  //     title,
  //     price,
  //     description,
  //     imageURL,
  //     null,
  //     req.user._id
  //   );
  //   try {
  //     await product.save();
  //     res.redirect("/admin/products");
  //   } catch (e) {
  //     console.log(e);
  //   }
};

// /admin/products => GET
const getAdminProducts = async (req, res, next) => {
  // ========== mongoose method ========== //
  try {
    const products = await Product.find();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (e) {
    console.log(e);
  }

  //   // ========== mongodb driver method ========== //
  //   try {
  //     const products = await Product.fetchAll();
  //     res.render("admin/products", {
  //       prods: products,
  //       pageTitle: "Admin Products",
  //       path: "/admin/products",
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
};

// /admin/edit-product/{productID}?edit=value => GET (Using query params and dynamic routing)
const getEditProduct = async (req, res, next) => {
  // Access query params using req.query.queryParamKey
  const editMode = req.query.edit;
  if (!(editMode === "true")) {
    return res.redirect("/");
  }

  // use req.params.{dynamicVariable} to access the dynamic variable that we inserted into the URL
  const productID = req.params.productID;
  try {
    const product = await Product.findById(productID);
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (e) {
    console.log(e);
  }
};

// /admin/edit-product => POST
const postEditProduct = async (req, res, next) => {
  // ========== mongoose method ========== //
  // When user submits form for editing a product via edit-product.ejs, we can retrieve the updated input values using req.body
  const productID = req.body.productID;
  const updatedTitle = req.body.title;
  const updatedImageURL = req.body.imageURL;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  try {
    // Retrieve the product and update its fields
    const product = await Product.findById(productID);
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDescription;
    product.imageURL = updatedImageURL;
    await product.save(); // .save() to update the product using mongoose
    res.redirect("/admin/products");
  } catch (e) {
    console.log(e);
  }

  //     // ========== mongodb driver method ========== //
  //   // When user submits form for editing a product via edit-product.ejs, we can retrieve the updated input values using req.body
  //   const productID = req.body.productID;
  //   const updatedTitle = req.body.title;
  //   const updatedImageURL = req.body.imageURL;
  //   const updatedPrice = req.body.price;
  //   const updatedDescription = req.body.description;
  //   try {
  //     // Create a new product object and call .save(), which will automatically update the existing product since it has an existing id
  //     const product = new Product(
  //       updatedTitle,
  //       updatedPrice,
  //       updatedDescription,
  //       updatedImageURL,
  //       productID
  //     );
  //     await product.save();
  //     // Then, we store the product back into the database using .save() => Note that .save() return a promise
  //     // If product record does not exist yet, .save() will create a new record. Else, it will update the existing product record
  //     res.redirect("/admin/products");
  //   } catch (e) {
  //     console.log(e);
  //   }
};

// /admin/delete-product => POST
const postDeleteProduct = async (req, res, next) => {
  // ========== mongoose method ========== //
  const productID = req.body.productID;
  try {
    // .findByIdAndDelete() is a mongoose method that deletes the document with the specific id
    await Product.findByIdAndDelete(productID);
    res.redirect("/admin/products");
  } catch (e) {
    console.log(e);
  }

  //     // ========== mongodb driver method ========== //
  // const productID = req.body.productID;
  // try {
  //   await Product.deleteById(productID);
  //   res.redirect("/admin/products");
  // } catch (e) {
  //   console.log(e);
  // }
};

module.exports = {
  getAddProductPage,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
