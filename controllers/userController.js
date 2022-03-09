const session = require('express-session');
const User = require('../models/User.js');
const Type = require('../models/Type.js');
const Expense = require('../models/Expense.js');
const { validationResult } = require('express-validator');
const axios = require('axios');
const querystring = require('querystring');
const customError = require('../customError.js')

exports.createUser = (req, res) => {
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
                errors.push({ msg: 'reCAPTCHA failed. Score: ' + response.data.score + ", Success: " + response.data.success })
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

                let type = new Type({
                    name: 'Other',
                    user: user._id
                });

                user.types.push(type)//every new user starts with a "Other" type.
                type.save()
                user.save()
                    .then(() => {
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

                let errorObject = new customError(errorMessages, 422);

                res.status(errorObject.status).send(errorObject);

            }
        })
        .catch(error => {
            console.log(error)
            res.send(error)

        });
}

exports.login = (req, res) => {

    //verify token agaisnt reCAPTCHA service
    axios.post('https://www.google.com/recaptcha/api/siteverify',
        querystring.stringify({
            secret: process.env.RECAPTCHA_SECRET,
            response: req.body.token
        })
    )
        .then(response => {
            //If validation fails or score is too low, push an error inside Error's array
            if (!response.data.success || response.data.score < 0.70) {
                console.log('reCAPTCHA failed');
                //errors.push({ msg: 'reCAPTCHA failed. Score: ' + response.data.score + ", Success: " + response.data.success })

                let rError = new customError(['reCAPTCHA failed', 'Score: ' +  response.data.score], 401)
                res.status(rError.status).send(rError);
            }
        })
        .then(() => {
            User.findOne({ email: req.body.email })
                .exec()
                .then(user => {
                    if (user == null) {
                        throw new customError(['User not found'], 401)
                    }
                    else if (req.body.password != user.password) {
                        throw new customError(['Password is incorrect'], 401)
                    } else {
                        req.session.userId = user._id;
                        req.session.isAuth = true;
                        res.send({ _id: user._id });

                    }

                })
                .catch(error => {
                    console.log(error)
                    res.status(error.status).send(error);
                });
        })


}

exports.logout = (req, res) => {

    try {
        if (req.session.isAuth) {
            req.session.userId = null;
            req.session.isAuth = false;
            res.status(200).send('logged out');
        } else {
            throw new customError(['Unable to log out. User not logged in'], 404)
        }
    } catch (error) {
        console.log(error)
        res.status(error.status).send(error);
    }

}

exports.verifyAuth = (req, res) => {
    try {
        if (req.session.isAuth) {
            res.status(200).send({ _id: req.session.userId })
        } else {
            throw new customError(['User not logged in'], 404)
        }
    } catch (error) {
        console.log(error)
        res.status(error.status).send(error);
    }

}
