const getDb = require("../util/database").getDb;

// Define a Product collection for our database in mongodb
class Product {
  constructor(title, price, description, imageURL) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
  }

  // Manual function to create a Product record
  async save() {
    try {
      // Get access to db
      const db = getDb();
      // Get access to products collection and insert one product document
      const result = await db.collection("products").insertOne(this); // .insertOne() accepts a object as a parameter. In this case, "This"
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  static async fetchAll() {
    // .find() is used to search for documents. We can include a config object to filter by specific key-value pairs
    // Note that .find() returns a cursor, which allows us to iterate through the returned results 1 by 1
    // To access all of the results at once, we can use .toArray()
    try {
      const db = getDb();
      const products = await db.collection("products").find().toArray();
      // console.log(products);
      return products;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Product;

// // ========= Using sequelize ========== //
// // Define a new model (table) in the database using sequelize.define() - https://sequelize.org/docs/v6/core-concepts/model-basics/#model-definition
// // See app.js on how to create this table in the database
// const Product = sequelize.define("product", {
//   // Model attributes are defined here
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true, // Set id to auto increment
//     allowNull: false, // allowNull defaults to True
//     primaryKey: true,
//   },
//   title: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageURL: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });
