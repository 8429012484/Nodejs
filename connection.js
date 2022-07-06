 var mysql = require('mysql');
function createConnection(){
    return  mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "vdc_app"
      });
}

 module.exports = {createConnection}

