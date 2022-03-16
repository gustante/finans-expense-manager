const router = require('express').Router();
const {createUser, login, logout, verifyAuth, getNoOfExpenses, getBudgetInfo} = require("../controllers/userController.js");
const {userValidator} = require('../validator.js');

router.post('/register', userValidator, createUser)
router.post('/login', userValidator, login)
router.get('/logout', logout)
router.get('/verifyAuth', verifyAuth)
router.get('/noOfExpenses', getNoOfExpenses)
router.get('/budgetInfo', getBudgetInfo)

module.exports = router;
