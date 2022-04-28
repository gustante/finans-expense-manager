const router = require('express').Router();

const {oauth} = require("../controllers/oauthController.js");

const {oauthMiddleware} = require('../passport.js');

router.get('/', oauthMiddleware, oauth) 

module.exports = router;
