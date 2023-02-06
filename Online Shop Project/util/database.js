const mysql = require("mysql2");
const config = require("../config.json");

// .createPool() creates a pool of connections which allows us to make a connection whenever we need to
// It also allows us to run multiple connections concurrently
const pool = mysql.createPool(config);

// export with .promise() to allow connections to work using promises instead of callbacks
module.exports = pool.promise();
