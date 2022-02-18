const session = require('express-session');
const User = require('../models/User.js');
const { validationResult } = require('express-validator');
const axios = require('axios');
const querystring = require('querystring');

exports.createUser = (req,res)=>{
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
        //if there are not validation errors, create new user and save it to database
        if (errors.length < 1) {
            let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                phoneNumber: req.body.phoneNumber,
            });

            user.save()
            .then(()=>{
                console.log("user created succesfully")
                res.status(201).send(user);//status 201
            })
            .catch(error => {
                console.log(error)
                console.log("user already existes")
                res.status(422).send(error);
        
            });
            
            
    

        } else { // if there are errors, extracts messages from validation errors array and send to frontend
            let errorMessages = [];
            for (let i of errors) {
                errorMessages.push(i.msg)
            }

            class customError extends Error {
                constructor(errorMessages, status, message) {
                    super(message);
                    this.data = errorMessages;
                    this.status = status;
                }
            }
            let errorObject = new customError(errorMessages, 422);

            res.status(errorObject.status).send(errorObject);

        }
    })
    .catch(error => {
        console.log(error)
        res.send(error)

    });
}
