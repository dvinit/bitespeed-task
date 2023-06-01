const mysql = require('mysql');
const contacts = require('./routes/contacts');
const express = require('express');
const app = express();
//require('./startup/db');
app.use(express.json());
app.use('/api/identify', contacts);

var con = mysql.createConnection({
    host: process.env.PRIVATE_HOST,
    user: process.env.USER_NAME,
    password: process.env.KEY
  });
  
  try{
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mysql database ... now creating databases and tables");
    con.query("CREATE DATABASE IF NOT EXISTS CONTACTS_DB ", function (err, result) {
        if (err) throw err;
        console.log("Database created...");
      });
    var sql =  "CREATE TABLE IF NOT EXISTS CONTACTS_DB.contacts (id int auto_increment, phoneNumber varchar(255) , email varchar(255) , linkedId int, linkPrecedence varchar(255), createdAt varchar(255), updatedAt varchar(255), deletedAt varchar(255),PRIMARY KEY(id) ) ";
    con.query(sql,function (err, result) {
        if (err) throw err;
        console.log("Contacts table also created...");
      });  

  });
  }
  catch(ex){
console.log("Couldn't connect to mysql database...");
console.log(ex);
  }
   const port= process.env.PORT || 3000 ;
app.listen(port ,() => console.log(`Listening on port ${port}`));

