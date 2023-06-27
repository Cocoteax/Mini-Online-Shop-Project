const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

// Define a Product collection for our database in mongodb
class Product {
  constructor(title, price, description, imageURL, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageURL = imageURL;
    this._id = new mongodb.ObjectId(id); // Optional attribute, if NULL then mongodb will automatically create it for us
  }

  // Function to create a Product record
  async save() {
    try {
      // Get access to db
      const db = getDb();
      // If user updates an existing product document, there will be an id associated to it
      if (this._id) {
        // First parameter of .updateOne() is the filter config object, second parameter is an object which specifies what fields of that particular document should we update
        const result = await db
          .collection("products")
          .updateOne({ _id: this._id }, { $set: this }); // By using this, we are updating all fields of the product
      } else {
        // Else, get access to products collection and insert one new product document
        const result = await db.collection("products").insertOne(this); // .insertOne() accepts a object as a parameter. In this case, "This"
        console.log(result);
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Function to fetch all products
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

  // Function to fetch a single product based on id
  static async findById(productID) {
    try {
      const db = getDb();
      // .next() is used to get the next document returned by the cursor from .find()
      // mongodb stores id as an ObjectId type, hence we convert the id string from parameter to a ObjectId
      const product = await db
        .collection("products")
        .find({ _id: new mongodb.ObjectId(productID) }) // Alternatively, use findOne() so we don't need .next()
        .next();
      return product;
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
