// Sequelize is a library that performs object relational mapping (ORM)
// This allows us to work with JS objects instead of writing SQL queries
const Sequelize = require("sequelize");

// Set up a connection with mysql db
const sequelize = new Sequelize("Mini-Online-Shop-Project", "root", "Zealpeac3", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

// ========== Using mysql2 ==========
// const mysql = require("mysql2");
// const config = require("../config.json");

// // .createPool() creates a pool of connections which allows us to make a connection whenever we need to
// // It also allows us to run multiple connections concurrently
// const pool = mysql.createPool(config);

// // export with .promise() to allow connections to work using promises instead of callbacks
// module.exports = pool.promise();
