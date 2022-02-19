const Type = require('../models/Type.js');
const { validationResult } = require('express-validator');
const axios = require('axios');
const querystring = require('querystring');
const customError = require('../customError.js')

exports.getAllTypes = (req, res) => {
    Type.find({}).exec()
        .then(results => {
            res.send(results);

        })
        .catch(error => res.send(error));
}

//post new type
exports.postType = (req, res) => {
    //validate fields
    const errors = (validationResult(req)).array();

    //verify token agaisnt reCAPTCHA service
    axios.post('https://www.google.com/recaptcha/api/siteverify',
        querystring.stringify({
            secret: process.env.RECAPTCHA_SECRET,
            response: req.body.token
        })
    )
        .then(response => {
            //If validation fails or score is too low, push an error inside Error's array
            if (!response.data.success || response.data.score < 0.80) {
                console.log('reCAPTCHA failed');
                errors.push({ msg: 'reCAPTCHA failed. Score: '+ response.data.score + ", Success: " + response.data.success })
            }
        })
        .then(() => {
            //if there are not validation errors, create new expense and save it to database
            if (errors.length < 1) {
                let type = new Type({
                    name: req.body.name,
                });

                type.save()
                    .then(savedType => {
                        res.status(201).send(savedType);//status 201
                    })
                    .catch(error => {
                        res.send(error)

                    });

            } else { // if there are errors, extracts messages from validation errors array and send to frontend
                let errorMessages = [];
                for (let i of errors) {
                    errorMessages.push(i.msg)
                }

                let errorObject = new customError(errorMessages, 422);

                res.status(errorObject.status).send(errorObject);

            }
        })



}

////delete expense by id which is passed by thery
exports.deleteType = (req,res)=>{

    Type.findOne({"name": req.query.type}).exec()//search for a type with the value passed
    .then(chosenType=>{//if finds, delete
        if(chosenType != null){
            if (chosenType.name != "Other"){
                Type.deleteOne({name: chosenType.name}).exec()
                .then(deletedType=>{
                    res.send(deletedType);
                })
            } else {
                let errorMessages = [];
                errorMessages.push(['"Other" type cannot be deleted'])
                let errorObject = new customError(errorMessages, 422);
                res.status(errorObject.status).send(errorObject);
            }            
        } else {//if no type is found, or if user tried to delete "Other", send error message
            let errorMessages = [];
            errorMessages.push(['Please input correct type you wish to delete from the list'])
            let errorObject = new customError(errorMessages, 422);

            res.status(errorObject.status).send(errorObject);
        }
       
    })

}

