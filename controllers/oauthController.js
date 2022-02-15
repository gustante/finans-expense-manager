const passport = require('passport');
const session = require('express-session');
const axios = require('axios');


exports.oauth = (req,res)=>{
    console.log("route working.")
    res.send("working")
}
