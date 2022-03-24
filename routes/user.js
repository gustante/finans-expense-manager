const router = require('express').Router();
const {createUser, login, logout, verifyAuth, getNoOfExpenses, updateUser} = require("../controllers/userController.js");
const {userRegisterValidator, userLoginValidator, userUpdateValidator} = require('../validator.js');

router.post('/register', userRegisterValidator, createUser)
router.post('/login', userLoginValidator, login)
router.get('/logout', logout)
router.get('/verifyAuth', verifyAuth)
router.get('/noOfExpenses', getNoOfExpenses)
router.put('/updateUser', userUpdateValidator, updateUser)

module.exports = router;
