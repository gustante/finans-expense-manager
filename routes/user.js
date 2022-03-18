const router = require('express').Router();
const {createUser, login, logout, verifyAuth, getNoOfExpenses, getBudgetInfo} = require("../controllers/userController.js");
const {userRegisterValidator} = require('../validator.js');
const {userLoginValidator} = require('../validator.js');

router.post('/register', userRegisterValidator, createUser)
router.post('/login', userLoginValidator, login)
router.get('/logout', logout)
router.get('/verifyAuth', verifyAuth)
router.get('/noOfExpenses', getNoOfExpenses)
router.get('/budgetInfo', getBudgetInfo)

module.exports = router;
