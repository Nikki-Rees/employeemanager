const mysql = require("mysql");

exports.createConnection = () => mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "!27ComptonRd",
    database: "employeeManager_db"
});

