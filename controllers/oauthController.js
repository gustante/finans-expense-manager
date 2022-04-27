const passport = require('passport');
const session = require('express-session');
const axios = require('axios');


// exports.oauth = (req,res)=>{
//     console.log("route working.")

//     //res.send("working")
// }

// exports.callback = (req,res)=>{
//     passport.authenticate( 'google', {
//         successRedirect: '/api/v1.0/auth/google/login',
//         failureRedirect: '/api/v1.0/auth/google/authFail'
//     })
// }

exports.login = (req,res)=>{
    res.send(`Hello ${req.user.given_name}! You have succesfully logged in with Google. But this feature isn't ready yet :(  Please go back and create an account manually. <p> <a href="/api/v1.0/oauth/google/logout">Logout</a> </p>`);
}

exports.authFail = (req,res)=>{
    res.send("something went wrong")
}

exports.logout = (req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/#/login')
}
