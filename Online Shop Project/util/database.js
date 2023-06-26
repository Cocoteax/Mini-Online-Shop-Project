const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient; // Required to connect to mongodb

let db; // Create a db variable which will eventually contain the access to a specific db (See mongoConnect() below)

// This method helps app.js to establish a persistant connection to mongoDB
const mongoConnect = async () => {
  try {
    // .connect() gives us connection to mongoDB
    let client = await MongoClient.connect(
      "mongodb+srv://admin:admin123@cluster0.dnoygrc.mongodb.net/?retryWrites=true&w=majority"
    );
    // .db() gives us access to the database specified in the parameter and stores it into db variable
    db = client.db("shop");
    console.log("Connected to MongoDB!");
  } catch (e) {
    console.log(e);
  }
};

// This method returns access to the specified db (Can be used in other modules such as controllers to perform queries)
const getDb = () => {
  if (db) {
    return db;
  }
  throw "No database found";
};

module.exports = { mongoConnect, getDb };
