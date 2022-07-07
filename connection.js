 var mysql = require('mysql');
function createConnection(){
    return  mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "node_test"
      });
}

 module.exports = {createConnection}

