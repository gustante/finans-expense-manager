const router = require('express').Router();
const {createUser} = require("../controllers/userController.js");
const {userValidator} = require('../validator.js');

router.post('/', userValidator, createUser) 

module.exports = router;
