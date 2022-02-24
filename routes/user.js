const router = require('express').Router();
const {createUser, login, logout, verifyAuth} = require("../controllers/userController.js");
const {userValidator} = require('../validator.js');

router.post('/register', userValidator, createUser)
router.post('/login', userValidator, login) 
router.get('/logout', logout) 
router.get('/verifyAuth', verifyAuth) 

module.exports = router;
