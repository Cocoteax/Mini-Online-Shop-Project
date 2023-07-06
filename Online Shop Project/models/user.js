const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
const mongoose = require("mongoose");

// // ========== mongodb driver method ========== //
// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     // Embed a cart document into the user document (I.e., cart is associated to user (1-to-1))
//     this.cart = cart ? cart : { items: [] }; // {items: []} will be the structure of cart documents
//     this._id = new mongodb.ObjectId(id); // Optional attribute, else mongodb will generate one for us
//   }

//   async save() {
//     try {
//       const db = getDb();
//       const user = await db.collection("users").insertOne(this); // If users is not an existing collection, mongodb will automatically create one
//       console.log(user);
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   // Function that accepts a product document and adds it to cart
//   async addToCart(product) {
//     const db = getDb();
//     try {
//       const updatedCartItems = [...this.cart.items];

//       // Check if there is an existing product in the cart by comparing productID
//       const existingProductIndex = this.cart.items.findIndex((cartProduct) => {
//         return cartProduct.productID.toString() === product._id.toString();
//       });

//       // findIndex returns the index of the cartProduct if exist, else return -1
//       if (existingProductIndex >= 0) {
//         this.cart.items[existingProductIndex].quantity += 1; // Update quantity only
//       } else {
//         // Push a new product item into the cart
//         updatedCartItems.push({
//           productID: new mongodb.ObjectId(product._id),
//           quantity: 1,
//         });
//       }

//       const updatedCart = {
//         items: updatedCartItems,
//       };
//       // First argument to filter the user, second argument to update only the cart
//       await db
//         .collection("users")
//         .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//       return result;
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   // Function to get all cart items associated to a user
//   async getCartItems() {
//     try {
//       const db = getDb();
//       const productIDs = this.cart.items.map((product) => product.productID);
//       // Get all cartItems by accessing the productIDs inside the user's cart and using the IDs to query product collection
//       const products = await db
//         .collection("products")
//         .find({ _id: { $in: productIDs } }) // Special mongodb syntax to find and return all _id which is $in productIDs ar
//         .toArray();
//       // Add back the quantity value into the corresponding product object
//       const cartItems = products.map((product) => {
//         return {
//           ...product,
//           // Get quantity by using the productID to find the corresponding product in the cart and getting its quantity
//           quantity: this.cart.items.find(
//             (cartProduct) =>
//               cartProduct.productID.toString() === product._id.toString()
//           ).quantity,
//         };
//       });
//       return cartItems;
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   // Function to delete item from cart
//   async deleteItemFromCart(productID) {
//     try {
//       const db = getDb();
//       // use .filter() to remove the product with the specific productID from cart.items
//       const updatedCartProducts = this.cart.items.filter(
//         (product) => product.productID.toString() !== productID.toString()
//       );
//       const updatedCart = {
//         items: updatedCartProducts,
//       };
//       await db
//         .collection("users")
//         .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   // Function to add an order
//   async addOrder() {
//     try {
//       const db = getDb();
//       const cartItems = await this.getCartItems(); // Call .getCartItems() to get all the product information to include in orders
//       console.log(cartItems);
//       const order = {
//         items: cartItems,
//         user: {
//           _id: this._id,
//           name: this.name,
//         },
//       };
//       // Add all cart items to a new order document
//       const result = await db.collection("orders").insertOne(order);
//       // Empty cart after creating order
//       this.cart = { items: [] };
//       await db
//         .collection("users")
//         .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   // Function to get orders
//   async getOrders() {
//     try {
//       const db = getDb();
//       // Get all orders for that specific userID
//       const orders = await db
//         .collection("orders")
//         .find({ "user._id": this._id }) // Since _id is a nested field (within user) in the orders collection, we access it by using quotation marks
//         .toArray();
//       return orders;
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   static async findById(userID) {
//     try {
//       const db = getDb();
//       const user = await db
//         .collection("users")
//         .findOne({ _id: new mongodb.ObjectId(userID) });
//       return user;
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }

// module.exports = User;
