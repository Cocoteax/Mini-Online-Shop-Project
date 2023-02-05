const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

// Set the path for storing/retrieving product data into/from cart.json
const p = path.join(rootDir, "data", "cart.json");

class Cart {
  static addProduct(id, productPrice) {
    // First, we fetch product data from cart.json
    fs.readFile(p, (e, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!e) {
        cart = JSON.parse(fileContent);
      }
      // Check if there is an existing product in the cart
      const existingProductIndex = cart.products.findIndex((p) => p.id === id); // existingProduct is a product object inside the products ar
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // If existing product, then we just increase the product qty by 1 and update the product in the products ar
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct; // update the existing product in the cart
      }
      // Else, we create a new product object and add it to products ar
      else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      // Increase cart total price
      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (e) => {
        console.log("Error is:", e);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (e, fileContent) => {
      if (e) {
        return; // no cart found if theres error reading the file
      }
      const cart = JSON.parse(fileContent);
      const updatedCart = { ...cart };
      // find product to be deleted
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (product === undefined) {
        return console.log("product not in cart");
      }
      const productQty = product.qty;
      // remove product from cart
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      // reduce total price
      updatedCart.totalPrice -= productQty * productPrice;
      // store updated cart back to cart.json
      fs.writeFile(p, JSON.stringify(updatedCart), (e) => {
        console.log("Error is:", e);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (e, fileContent) => {
      if (e) {
        cb(null);
      } else {
        const cart = JSON.parse(fileContent);
        cb(cart);
      }
    });
  }
}

module.exports = Cart;
