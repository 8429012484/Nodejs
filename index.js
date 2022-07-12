const express = require('express');
const bodyParser = require('body-parser');
const dbConnection = require('./connection'); 
const db = dbConnection.createConnection();
const bcrypt = require('bcryptjs');
const e = require('express');
const app = express();
var port = 3002;
const { register } = require('./validation.js');
//app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));

var response = {
  "statusCode":"404",
  "status":"Error",
  "message":"Oops! Something went wrong!",
  "data":"",
}

function encryption(password,returnval){
bcrypt.genSalt(10, function (err, Salt) {
    bcrypt.hash(password, Salt, function (err, hash) {
        if (err){
          returnval({'error':err});
        }else{
          returnval({'hash':hash});
        }
    })
})

}

encryption(password='34324324',function(result){
  if("hash" in result){
    password = result['hash'];
  }
});
console.log(password);

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

// Handling Errors

 app.post('/register',register, (req, res) => {  
  input = req.body;
  var genpass = '123456789';
  encryption(genpass,function(result){
    if("hash" in result){
      password = result['hash'];
        query = `Insert into users (name,email,phone,password)values("${input.name}","${input.email}","${input.phone}","${genpass}")`;
        makeQuery(query,function(result){
          if("success" in result){
            response.statusCode = '200';
            response.status     = 'Success';
            response.data       = result['success'];
            response.message    = "User Registered Succesfully";
          }else{
            response.statusCode = '404';
            response.status     = 'error';
            response.data       = '';
            response.message    = result;
          }
          res.send(response);
      });
    }
  });
});


app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});



app.post('/login', (req, res) => {  
  input = req.body;
  var genpass = input.password;
  encryption(genpass,function(result){
    if("hash" in result){
      password = result['hash'];
      query = `Select * From users where email='${input.email}' AND password='${genpass}' order by id desc limit  0,1`;
      response.query = query;
      makeQuery(query,function(result){
        if("success" in result){
          if(result['success'].length == 1){
            response.statusCode = '200';
            response.status     = 'Success';
            response.data       = result['success'];
            response.message    = "Logged in successfully";
          }else{
            response.statusCode = '404';
            response.status     = 'Error';
            response.message    = "Invalid Credentials";
          }
        }else{
          response.statusCode = '404';
          response.status     = 'error';
          response.data       = '';
          response.message    = result;
        }
        res.send(response);
    });
    }
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

