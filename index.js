var mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const dbConnection = require('./connection'); 
const db = dbConnection.createConnection();
const app = express();
var port = 3000;

var response = {
  "statusCode":"404",
  "status":"Error",
  "message":"Oops! Something went wrong!",
  "data":"",
}
app.use(bodyParser.json());
app.post('/add',(req,res)=>{
  req = req.body;
 res.send(req.name);
});

app.post('/', (req, res) => {
    var id =  8;
    query = `SELECT cm.id,cm.lang_id,cm.title,cm.description,cpm.price FROM course_master as cm JOIN course_price_master as cpm ON cm.id=cpm.course_id`;
    makeQuery(query,function(result){
      if(result!=''){
        response.statusCode = '200';
        response.status     = 'Success';
        response.data       = result;
        response.message    = "Data Fetch Succesfully";
      }else{
        response.statusCode = '404';
        response.status     = 'Success';
        response.data       = '';
        response.message    = "No Data Found";
      }
      res.send(response);
  });
});

function makeQuery(string,callback){
  db.getConnection(function(err,connection) {
    if (err) throw err;
    connection.query(string, function (err, result ) {
        if (err) throw err;
          return callback(result);
      });
    });
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

