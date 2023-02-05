const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");
const Cart = require("./cart");

// Set the path for storing/retrieving product data into/from products.json
const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (e, fileContent) => {
    if (e) {
      // Execute the callback function which is passed into getProductsFromFile() as an argument
      // Note how we use an empty array as the argument for the callback function
      cb([]);
    } else {
      // Execute the callback function which is passed into getProductsFromFilel() as an argument
      // Note how we use the product array from the fileContent as the argument for the callback function
      cb(JSON.parse(fileContent));
    }
  });
};

// product model which represents our data for this application
class Product {
  constructor(id, title, imageURL, price, description) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
  }

  // Store the user inserted OR updated products into products.json
  save() {
    // First, we read the existing products data
    getProductsFromFile((products) => {
      // If there is an existing product, then we are updating the product
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (p) => p.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (e) => {
          console.log("Error is:", e);
        });
      }
      // Else, we are creating a new product. Hence, we assign the new product an id, push it to the products ar, and write it to file
      else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (e) => {
          console.log("Error is:", e);
        });
      }
    });
  }

  // static keyword allows us to call fetchAll() without instantiating a Product object
  // we just need to call the class name and use dot notation
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  // return a product based on productID
  static findById(id, cb) {
    // Note how we pass a callback function to getProductsFromFile(), see above on how this callback function executes
    getProductsFromFile((products) => {
      // In the cb function, we will use .find() on the products array to find the product with the corresponding id
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }

  // delete a product based on productID
  static deleteById(id) {
    // Note how we pass a callback function to getProductsFromFile(), see above on how this callback function executes
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      // delete the product by using .filter() and return all products that do not have the id
      const updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (e) => {
        if (!e) {
          // remove product from cart as well
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
}

module.exports = Product;
