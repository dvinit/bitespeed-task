class Contact {
    
    id   ;             
    phoneNumber   ;
    email    ;
    linkedId   ; // the ID of another Contact linked to this one
    linkPrecedence  ; // "primary" if it's the first Contact in the link
    createdAt        ;          
    updatedAt       ;           
    deletedAt      ;

  
    constructor(email , phoneNumber) {
     this.phoneNumber=phoneNumber;
     this.email=email;   
     this.createdAt = new Date();
     this.updatedAt = new Date();
     this.linkPrecedence="primary";
     this.linkedId=null;
     this.deletedAt=null;
    }
  
   
  }

  module.exports.Contact=Contact;