const expresss = require('express');
const mysql = require('mysql');
const router = expresss.Router();
const {Contact} = require('../models/contact') ;
const { Contactinfo } = require('../models/contactinfo');


var con = mysql.createConnection({
    host: "localhost",
    user: "vinit",
    password: "1234",
    database: "CONTACTS_DB"
  });

  con.connect();


router.get('/',(req,res) =>{
res.status(200).send("Seems like you made a get request! No worries try making a post request with fields email or phoneNumber in json format"); });

router.post('/',async(req,res) =>{

const email = req.body.email;
const phoneNumber = req.body.phoneNumber;

if(email ==null && phoneNumber==null)
return res.status(400).send("Atleast one of email or phoneNumber should exist");

var contact1 = new Contact(email,phoneNumber);
var query = "INSERT INTO contacts SET ?" ;
var obj ={
phoneNumber : phoneNumber,
email:email ,
linkedId : contact1.linkedId ,
linkPrecedence : contact1.linkPrecedence ,
createdAt: contact1.createdAt,
updatedAt: contact1.updatedAt,
deletedAt : contact1.deletedAt
}

var query1 = `SELECT  * FROM contacts WHERE ( (phoneNumber = '${phoneNumber}' OR email = '${email}' )) LIMIT 1 `;
var query5 = `SELECT * FROM contacts WHERE email='${email}' `;
var query6 = `SELECT * FROM contacts WHERE phoneNumber='${phoneNumber}' `;
var primary_id=0;
var new_info=false;

execute_query(query1).then((result) =>{
    if(result[0]){
console.log(result[0]);
console.log("Query1 done ...");
if(result[0].linkedId)
primary_id = result[0].linkedId;
else primary_id = result[0].id;
var query3 = `SELECT * FROM contacts WHERE ((phoneNumber = '${phoneNumber}' OR  email = '${email}') AND ( id <> '${primary_id}' AND (linkPrecedence ='primary' OR linkedId <> '${primary_id}') ) )` ;
execute_query(query3).then((data) =>{
    console.log("Result of query3");
    console.log(data);
var query4 = `UPDATE contacts SET linkPrecedence='secondary', linkedId=${primary_id}  WHERE (id=? OR linkedId=? )`; 
var idd;   
if(data && data[0]){ if(data[0].linkedId)idd=data[0].linkedId; else idd = data[0].id ; } else idd=0;

execute_query2(query4,[idd , idd]).then(() =>{
console.log("Secondary ids set and linkedIds also ...query4");    
execute_query(query5).then((sam)=>{
if(email){ if(sam[0]){ ; } else { new_info=true; } }
console.log("Query5 ...");
    execute_query(query6).then((dat) =>{
    if(phoneNumber){
    if(dat[0]){;}
    else { new_info=true; }
    }
    console.log("Query6 ...");
    if(new_info){
        obj.linkPrecedence="secondary";
        obj.linkedId =primary_id;
        
        execute_query2(query,obj).then((resu)=>{
            console.log('Contact with new info added ...');
            giveContactDetails(primary_id).then((info) => res.status(200).send(info));
        });
        
        }
        else {
            giveContactDetails(primary_id).then((info) => res.status(200).send(info));
        }

});   

});

});

});
    }
else {
 console.log("result is null... adding new contact");
 execute_query2(query,obj).then((result) =>{ 
console.log("New contact added ...");
primary_id = result.insertId;
giveContactDetails(primary_id).then((info) => res.status(200).send(info));
 });
}
});

});


function execute_query(query){

return new Promise((resolve,reject) =>{
    con.query(query,function(err,result,fields){    
    if(err)reject(new Error("Error in sql operation..."));
    if(result && result[0])console.log(result[0].phoneNumber);
    resolve(result);
}) ;  
});

}

function execute_query2(query,input){
    return new Promise((resolve,reject) =>{
        con.query(query,input ,function(err,result,fields){    
        if(err)reject(new Error("Error in sql operation..."));
        //if(result && result[0])console.log(result[0].phoneNumber);
        resolve(result);
    }) ;  
    });

}



function giveContactDetails(primary_id){

return new Promise((resolve,reject) =>{
    var contact_info = new Contactinfo(primary_id);
    console.log("Primary id is: ",primary_id);
    var query2 = `SELECT * FROM contacts WHERE (id = ${primary_id} OR linkedId=${primary_id})` ;
    
    execute_query(query2).then((result) =>{
    const emls = new Set();
    const pnos = new Set();    
    result.forEach(element => {
    if(element.email) emls.add(element.email);
    if(element.phoneNumber) pnos.add(element.phoneNumber);
    if(element.id!=primary_id)
    contact_info.secondaryContactIds.push(element.id);
    });
    
    emls.forEach(function(val){
        contact_info.emails.push(val);
    });
    pnos.forEach(function(val){
        contact_info.phoneNumbers.push(val);
    });
    resolve({contact:contact_info});
    });

});    

}

module.exports = router;