// Controllers contain the (req,res,next) logic of the middleware
// I.e., admin controller which manipulates data from the model and sends them to the view (MVC)
// The routes and http method define which controller code gets executed

// Get the Product class from the model
const Product = require("../models/product");

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
  // req.body gives us access to the POST request data (See bodyParser in app.js)
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const price = req.body.price;
  const description = req.body.description;
  // Create new product object from the Product model and call .save() to store the entered product into products ar
  const product = new Product(null, title, imageURL, price, description);
  try {
    await product.save();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
};

// /admin/products => GET
const getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

// /admin/edit-product/{productID}?edit=value => GET (Using query params and dynamic routing)
const getEditProduct = (req, res, next) => {
  // Access query params using req.query.queryParamKey
  const editMode = req.query.edit;
  if (!(editMode === "true")) {
    return res.redirect("/");
  }
  // use req.params.{dynamicVariable} to access the dynamic variable that we inserted into the URL
  const productID = req.params.productID;
  Product.findById(productID, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    // if query param edit=true, we render this page
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};

// /admin/edit-product => POST
const postEditProduct = (req, res, next) => {
  // When user submits form for editing a product via edit-product.ejs, we can retrieve the updated input values using req.body
  const productID = req.body.productID;
  const updatedTitle = req.body.title;
  const updatedImageURL = req.body.imageURL;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedProduct = new Product(
    productID,
    updatedTitle,
    updatedImageURL,
    updatedPrice,
    updatedDescription
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};

// /admin/delete-product => POST
const postDeleteProduct = (req, res, next) => {
  const productID = req.body.productID;
  Product.deleteById(productID);
  res.redirect("/admin/products");
};

module.exports = {
  getAddProductPage,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
