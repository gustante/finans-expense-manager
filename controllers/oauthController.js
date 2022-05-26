const axios = require('axios');
const User = require('../models/User.js');

exports.login = (req, res) => {
    console.log("made request to backend to get name from google")

    let googleUser = {
        firstName: req.user.given_name,
        lastName: req.user.family_name,
        email: req.user.email,
        phoneNumber: "",
        googleUser: true
    }


    //search for user in database. If not found, send axios request to create a new one. If found, send axios request to log them in.
    //In any case. Send below a response to frontend so we can change isLoggedIn over there. Then once we have it set to true, trigger a page refresh then redirect to dashboard... A page refresh will remount App.js which will send a new request to the back end to obtain the info on the user, then we will obtain their expenses.

    User.findOne({ email: req.user.email })//find the user that's making the request
        .exec()
        .then(user => {
            console.log("user is: " + user)

            if (user == null) {//if user doesn't exist, send it to front end to be created/logged in
                googleUser.exists = false;
                res.send(googleUser);

            } else {//if user exists, send it to front end to be logged in
                googleUser.exists = true;
                googleUser.password = "shhhh";
                res.send(googleUser);
            }
        })
        .catch(error => {
            console.log(error)
            res.send(error)
        });





}

exports.authFail = (req, res) => {
    res.send("something went wrong")
    res.redirect('/#/')
}

exports.logout = (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Logged out - google')
}
