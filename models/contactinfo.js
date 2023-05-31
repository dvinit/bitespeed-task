class Contactinfo {
    
    primaryContactId   ;             
    emails = []  ;
    phoneNumbers = []  ;
    secondaryContactIds = [];

    constructor(primaryContactId) {
     this.primaryContactId=primaryContactId;
    }
  
  }

  module.exports.Contactinfo=Contactinfo;