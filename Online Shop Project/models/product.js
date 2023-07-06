const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ========== mongoose method ========== //
// Schema defines how a document within a collection should be structured in mongoose
// Define each attribute of the document using a key-value pair
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true, // Enforce that every product document must have a title
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
  },
  { collection: "Product" } // Pass this object as a second arg to define the collection name
);

// mongoose.model() associates productSchema to a collection called "products" when we save a document into the collection
// Note that the name of the collection will be lower case by default unless we specify it in the Schema definition
module.exports = mongoose.model("Product", productSchema);

// // ========== mongodb driver method ========== //

// // Define a Product collection for our database in mongodb
// class Product {
//   constructor(title, price, description, imageURL, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageURL = imageURL;
//     this._id = id ? new mongodb.ObjectId(id) : null; // Optional attribute, if NULL then mongodb will automatically create it for us when we insert into mongodb
//     this.userId = userId; // Reference to user collection
//   }

//   // Function to create a Product record
//   async save() {
//     try {
//       // Get access to db
//       const db = getDb();
//       // If user updates an existing product document, there will be an id associated to it
//       if (this._id) {
//         // First parameter of .updateOne() is the filter config object, second parameter is an object which specifies what fields of that particular document should we update
//         const result = await db
//           .collection("products")
//           .updateOne({ _id: this._id }, { $set: this }); // By using this, we are updating all fields of the product
//         console.log(result);
//       } else {
//         // Else, get access to products collection and insert one new product document
//         const result = await db.collection("products").insertOne(this); // .insertOne() accepts a object as a parameter. In this case, "This"
//         console.log(result);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   // Function to fetch all products
//   static async fetchAll() {
//     // .find() is used to search for documents. We can include a config object to filter by specific key-value pairs
//     // Note that .find() returns a cursor, which allows us to iterate through the returned results 1 by 1
//     // To access all of the results at once, we can use .toArray()
//     try {
//       const db = getDb();
//       const products = await db.collection("products").find().toArray();
//       // console.log(products);
//       return products;
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   // Function to fetch a single product based on id
//   static async findById(productID) {
//     try {
//       const db = getDb();
//       // .next() is used to get the next document returned by the cursor from .find()
//       // mongodb stores id as an ObjectId type, hence we convert the id string from parameter to a ObjectId
//       const product = await db
//         .collection("products")
//         .find({ _id: new mongodb.ObjectId(productID) }) // Alternatively, use findOne() so we don't need .next()
//         .next();
//       return product;
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   // Function to delete a product based on id
//   static async deleteById(productID) {
//     try {
//       const db = getDb();
//       const result = await db.collection("products").deleteOne({
//         _id: new mongodb.ObjectId(productID),
//       });
//       console.log(result);
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }

// module.exports = Product;

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
