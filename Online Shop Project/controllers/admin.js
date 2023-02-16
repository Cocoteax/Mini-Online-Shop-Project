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

  try {
    // Since we created a belongsTo and hasMany association between user and product, sequelize provides us a special mixin (function) to create a product associated to the current user
    // We can directly access the user using req.user and call .createProduct() and pass in the relevant fields
    // Note that userId is automatically populated since we are accessing the current user and calling .createProduct()
    req.user.createProduct({
      title: title,
      imageURL: imageURL,
      price: price,
      description: description,
    });

    // // Alternatively, we can manually create the product using .create()
    // // .create() allows us to create a model record and save it directly to the database table => Note that it returns a promise
    // // .build() allows us to create a model record instance, which we then have to manually save it into the database table by using .save()
    // const product = await Product.create({
    //   title: title,
    //   imageURL: imageURL,
    //   price: price,
    //   description: description,
    //   userId: req.user.id, // We can access the current user that we stored into req.user through the app-level middleware
    // });
    res.redirect("/admin/products");
  } catch (e) {
    console.log(e);
  }
};

// /admin/products => GET
const getAdminProducts = async (req, res, next) => {
  try {
    // const products = await Product.findAll();
    const products = await req.user.getProducts(); // Alternative way to get products associated with current user by using the special mixin
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (e) {
    console.log(e);
  }
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
    const products = await req.user.getProducts({ where: { id: productID } }); // special mixin to get the product associated to the current user
    const product = products[0];
    // // Alternative methods to get product associated to the current suer
    // const product = await Product.findByPk(productID);
    // const product = await Product.findOne({
    //   where: { id: productID, userId: req.user.id },
    // });
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
  // When user submits form for editing a product via edit-product.ejs, we can retrieve the updated input values using req.body
  const productID = req.body.productID;
  const updatedTitle = req.body.title;
  const updatedImageURL = req.body.imageURL;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  try {
    // First, we retrieve the product to be updated from the database into a local const product
    const product = await Product.findByPk(productID);
    // Then, we update the local const product
    product.title = updatedTitle;
    product.imageURL = updatedImageURL;
    product.price = updatedPrice;
    product.description = updatedDescription;
    // Then, we store the product back into the database using .save() => Note that .save() return a promise
    // If product record does not exist yet, .save() will create a new record. Else, it will update the existing product record
    await product.save();
    res.redirect("/admin/products");
  } catch (e) {
    console.log(e);
  }

  // // Alternative way to update a record using .update()
  // try {
  //   await Product.update(
  //     {
  //       title: updatedTitle,
  //       price: updatedPrice,
  //       imageURL: updatedImageURL,
  //       description: updatedDescription,
  //     },
  //     { where: { id: productID } }
  //   );
  //   res.redirect("/admin/products");
  // } catch (e) {
  //   console.log(e);
  // }
};

// /admin/delete-product => POST
const postDeleteProduct = async (req, res, next) => {
  const productID = req.body.productID;
  try {
    // First, we find the product to be deleted
    const product = await Product.findByPk(productID);
    // Then, we delete the product using .destroy() => Note that .destroy() returns a promise
    // We can also pass a config object into .destroy() if needed (Refer to docs)
    await product.destroy();
    res.redirect("/admin/products");
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getAddProductPage,
  postAddProduct,
  getAdminProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
