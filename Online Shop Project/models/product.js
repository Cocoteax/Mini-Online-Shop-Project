// Sequelize is a library that performs object relational mapping (ORM)
// This allows us to work with JS objects instead of writing SQL queries
const Sequelize = require("sequelize");
const sequelize = require("../util/database");

// Define a new model (table) in the database using sequelize.define() - https://sequelize.org/docs/v6/core-concepts/model-basics/#model-definition
// See app.js on how to create this table in the database
const Product = sequelize.define("product", {
  // Model attributes are defined here
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true, // Set id to auto increment
    allowNull: false, // allowNull defaults to True
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageURL: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;

// ========== Using mysql2 instead of seqeulize ==========
// const db = require("../util/database");
// const Cart = require("./cart");

// // product model which represents our data for this application
// class Product {
//   constructor(id, title, imageURL, price, description) {
//     this.id = id;
//     this.title = title;
//     this.imageURL = imageURL;
//     this.price = price;
//     this.description = description;
//   }

//   // Store the user inserted OR updated products into products.json
//   save() {
//     // Insert data into mysql db by using INSERT INTO sql statement
//     // The ? symbol is the placeholder values, which will be replaced by the second array argument passed into .execute() (Order of ar matters)
//     return db.execute(
//       // "INSERT INTO products (title, price, imageURL, description) VALUES (?,?,?,?)",
//       // [this.title, this.price, this.imageURL, this.description]
//       `INSERT INTO products (title, price, imageURL, description) VALUES ("${this.title}","${this.price}","${this.imageURL}","${this.description}")`
//     );
//   }

//   // static keyword allows us to call fetchAll() without instantiating a Product object by using className.fetchAll()
//   static fetchAll() {
//     return db.execute("SELECT * FROM products"); // This returns a promise, hence we need to use then/catch or async/await after calling fetchAll()
//   }

//   // return a product based on productID
//   static findById(id) {
//     return db.execute(`SELECT * FROM products WHERE products.id = ${id}`)
//   }

//   // delete a product based on productID
//   static deleteById(id) {}
// }

// module.exports = Product;
