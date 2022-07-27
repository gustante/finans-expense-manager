const router = require('express').Router();
const {createLinkToken, exchangePublicToken, getTransactions, syncTransactions, getItems, unlinkAccount} = require("../controllers/plaidController.js");

router.post('/createLinkToken', createLinkToken),
router.post('/exchangePublicToken', exchangePublicToken),
router.get('/getTransactions', getTransactions),
router.get('/getItems', getItems),
router.post('/syncTransactions', syncTransactions),
router.delete('/unlinkAccount', unlinkAccount),



module.exports = router;
