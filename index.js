var mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const dbConnection = require('./connection'); 
const db = dbConnection.createConnection();
const app = express();
var port = 3000;
app.use(express.json());

var response = {
  "statusCode":"404",
  "status":"Error",
  "message":"Oops! Something went wrong!",
  "data":"",
}
app.post('/view', (req, res) => { 
    query = `Select * FROM users`;
    makeQuery(query,function(result){
      if("success" in result){
        response.statusCode = '200';
        response.status     = 'Success';
        response.data       = result;
        response.message    = "Data Fetch Succesfully";
      }else{
        response.statusCode = '404';
        response.status     = 'error';
        response.data       = '';
        response.message    = result;
      }
      res.send(response);
  });
});

app.post('/add', (req, res) => {  
  input = req.body;
  var password = '123456789';
  query = `Insert into users (name,email,phone,password)values("${input.name}","${input.email}","${input.phone}","${password}")`;
  makeQuery(query,function(result){
    if("success" in result){
      response.statusCode = '200';
      response.status     = 'Success';
      response.data       = result['success'].insertId;
      response.message    = "Data Fetch Succesfully";
    }else{
      response.statusCode = '404';
      response.status     = 'error';
      response.data       = '';
      response.message    = result;
    }
    res.send(response);
});
});

function makeQuery(string,callback){
  db.getConnection(function(err,connection) {
    if (err) throw err;
      connection.query(string, function (err, result ) {
        if (err){
          return callback({'error':err});
        }else{
          return callback({'success':result});
        }
      });
    });
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

