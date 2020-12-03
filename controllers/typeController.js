const Type = require('../models/Type.js');

const {validationResult} = require('express-validator');


exports.getAllTypes = (req,res)=>{
    //.sort() to 
    Type.find({}).exec()
    .then(results=>{
        res.send(results);
        
    })
    .catch(error=>res.send(error));
}

//post new type
exports.postType = (req,res)=>{
    //validate fields
    const errors = (validationResult(req)).array();

    //if there are not validation errors, create new expense and save it to database
    if(errors.length < 1){
        let type = new Type({
        name:req.body.name,
    });
    
    type.save()
    .then(savedType=>{
        res.status(201).send(savedType);//status 201
    })
    .catch(error=>{
        res.send(error)
        
    });
    
    } else { // if there are errors, extracts messages from validation errors array and send to frontend
        let errorMessages = [];
        for(let i of errors) {
            errorMessages.push(i.msg)
        }
        
        class customError extends Error {
          constructor(errorMessages, status, message) {
            super(message);
            this.data = errorMessages;
            this.status = status;
          }
        }
        let errorObject = new customError(errorMessages,422);
        
        res.status(errorObject.status).send(errorObject);
        
    }

}

