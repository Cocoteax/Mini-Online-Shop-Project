const db = require("../util/database");
const Cart = require("./cart");

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
  save() {}

  // static keyword allows us to call fetchAll() without instantiating a Product object by using className.fetchAll()
  static fetchAll() {
    return db.execute("SELECT * FROM products"); // This returns a promise, hence we need to use then/catch or async/await after calling fetchAll()
  }

  // return a product based on productID
  static findById(id) {}

  // delete a product based on productID
  static deleteById(id) {}
}

module.exports = Product;
