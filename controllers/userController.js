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
            if (!response.data.success || response.data.score < 0.2) {
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
                    lastLoginMonth: req.body.currentMonth,
                    lastLoginYear: req.body.currentYear
                });

                let type = new Type({
                    name: 'Other',
                    user: user._id,
                    budget: null,
                    sumOfExpenses: 0,
                });

                user.types.push(type)//every new user starts with a "Other" type.
                type.save()
                if(user.phoneNumber == null){
                    console.log("changing number")
                    user.phoneNumber = ""
                }

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
        if (!response.data.success || response.data.score < 0.2) {
            console.log('reCAPTCHA failed');
            //errors.push({ msg: 'reCAPTCHA failed. Score: ' + response.data.score + ", Success: " + response.data.success })

            let rError = new customError(['reCAPTCHA failed', 'Score: ' +  response.data.score], 401)
            res.status(rError.status).send(rError);
        }
    })
    .then(() => {
        if (errors.length < 1) {
            User.findOne({ email: req.body.email })
                .populate('types')
                .populate({
                    path: 'expenses',
                    populate: { path: 'type' }
                })
                .exec()
                .then(user => {
                    if (user == null) {
                        throw new customError(['User not found'], 401)
                    }
                    else if (req.body.password != user.password) {
                        throw new customError(['Password is incorrect'], 401)
                    } else {
                        //reset budget if detects new month
                        if (req.body.currentMonth > user.lastLoginMonth || req.body.currentYear > user.lastLoginYear) {

                            for (type of user.types) {
                                type.sumOfExpenses = 0;
                                //adjusts sumOfExpenses
                                for(expense of user.expenses){
                                    if(expense.month == req.body.currentMonth && expense.type.name == type.name){
                                        type.sumOfExpenses += expense.amount;

                                    }
                                }
                                type.save();
                            }
                            user.lastLoginMonth = req.body.currentMonth;//update last login
                            user.lastLoginYear = req.body.currentYear
                            user.save()
                                .then(savedUser=>{
                                    savedUser.password = "shhhh";
                                    req.session.userId = user._id;
                                    req.session.isAuth = true;
                                    res.send(savedUser)
                                })
                                .catch(error => {
                                    console.log(error)
                                    res.status(error.status).send(error);
                                });

                        } else {
                            user.password = "shhhh";
                            req.session.userId = user._id;
                            req.session.isAuth = true;
                            res.send(user);
                        }
                    }

                })
                .catch(error => {
                    console.log(error)
                    res.status(error.status).send(error);
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
            User.findOne({ _id: req.session.userId })
            .exec()
            .then(user=>{
                user.password = ""
                res.send(user)
            })

        } else {
            throw new customError(['User not logged in'], 404)
        }
    } catch (error) {
        console.log(error)
        res.status(error.status).send(error);
    }

}

exports.getNoOfExpenses = (req, res) => {
    if (req.session.isAuth) {
        User.findOne({ _id: req.session.userId })
            .select('expenses')//don't send user password
            .exec()
            .then(user => {
                res.send(user);
            })
            .catch(error => {
                console.log(error)
                res.send(error)
            });
    } else {
        let errorObject = new customError(['Please log in to see this information'], 401);
        res.status(errorObject.status).send(errorObject);
    }



}


exports.updateUser = (req, res) => {

    console.log(req.body)

    if (req.session.isAuth) {
        const errors = (validationResult(req)).array();



        if (errors.length < 1) {

            User.findOne({ _id: req.session.userId })
                .populate({
                    path: 'expenses',
                    populate: { path: 'type' }
                })
                .exec()
                .then(user => {
                        if(req.body.oldPassword && req.body.oldPassword != user.password){
                            throw new customError(['Old password is incorrect'], 403)
                        } else if(req.body.newPassword != req.body.repeatNewPassword) {
                            throw new customError(['Passwords don\'t match'], 403)
                        } else if(req.body.newPassword && req.body.newPassword != ""){
                            console.log("password will be changed")
                            user.password = req.body.newPassword
                        }

                        if(req.body.firstName && req.body.firstName != ""){
                            console.log("first name will be changed")
                            user.firstName = req.body.firstName
                        }
                        if(req.body.lastName && req.body.lastName != ""){
                            console.log("last name will be changed")
                            user.lastName = req.body.lastName
                        }
                        if(req.body.email && req.body.email != ""){
                            console.log("email will be changed")
                            user.email = req.body.email
                        }
                        if(req.body.phoneNumber && req.body.phoneNumber != ""){
                            console.log("phone number will be changed")
                            user.phoneNumber = req.body.phoneNumber
                        }


                        user.save()
                            .then(savedUser=>{
                                savedUser.password = ""
                                res.send(savedUser)
                            })


                })
                .catch(error => {
                    console.log(error)
                    res.status(error.status).send(error)
                });
            } else {
                    let errorMessages = [];
                    for (let i of errors) {
                        errorMessages.push(i.msg)
                    }

                    let errorObject = new customError(errorMessages, 422);
                    console.log("validation error sent")
                    res.status(errorObject.status).send(errorObject);

                }

    } else {
        let errorObject = new customError(['Please log in first'], 401);
        res.status(errorObject.status).send(errorObject);
    }

}
