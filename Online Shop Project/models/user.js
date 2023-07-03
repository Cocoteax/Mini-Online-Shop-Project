const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    // Embed a cart document into the user document (I.e., cart is associated to user (1-to-1))
    this.cart = cart ? cart : { items: [] }; // {items: []} will be the structure of cart documents
    this._id = new mongodb.ObjectId(id); // Optional attribute, else mongodb will generate one for us
  }

  async save() {
    try {
      const db = getDb();
      const user = await db.collection("users").insertOne(this);
      console.log(user);
    } catch (e) {
      console.log(e);
    }
  }

  // Function that accepts a product document and adds it to cart
  async addToCart(product) {
    const db = getDb();
    try {
      const updatedCartItems = [...this.cart.items];

      // Check if there is an existing product in the cart by comparing productID
      const existingProductIndex = this.cart.items.findIndex((cartProduct) => {
        return cartProduct.productID.toString() === product._id.toString();
      });

      // findIndex returns the index of the cartProduct if exist, else return -1
      if (existingProductIndex >= 0) {
        this.cart.items[existingProductIndex].quantity += 1; // Update quantity only
      } else {
        // Push a new product item into the cart
        updatedCartItems.push({
          productID: new mongodb.ObjectId(product._id),
          quantity: 1,
        });
      }

      const updatedCart = {
        items: updatedCartItems,
      };
      // First argument to filter the user, second argument to update only the cart
      const result = await db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  // Function to get all cart items associated to a user
  async getCartItems() {
    try {
      const db = getDb();
      const productIDs = this.cart.items.map((product) => product.productID);
      // Get all cartItems by accessing the productIDs inside the user's cart and using the IDs to query product collection
      const products = await db
        .collection("products")
        .find({ _id: { $in: productIDs } })
        .toArray(); // Special mongodb syntax to find and return all _id which is $in productIDs ar
      // Add back the quantity value into the corresponding product object
      const cartItems = products.map((product) => {
        return {
          ...product,
          // Get quantity by using the productID to find the corresponding product in the cart and getting its quantity
          quantity: this.cart.items.find(
            (cartProduct) =>
              cartProduct.productID.toString() === product._id.toString()
          ).quantity,
        };
      });
      return cartItems;
    } catch (e) {
      console.log(e);
    }
  }

  // Function to delete item from cart
  async deleteItemFromCart(productID) {
    try {
      const db = getDb();
      const updatedCart = this.cart.items.filter(
        (product) => product.productID.toString() !== productID.toString()
      );
      await db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
    } catch (e) {
      console.log(e);
    }
  }

  static async findById(userID) {
    try {
      const db = getDb();
      const user = await db
        .collection("users")
        .findOne({ _id: new mongodb.ObjectId(userID) });
      return user;
      console.log(user);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = User;
