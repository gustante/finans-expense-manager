const router = require('express').Router();
const {createLinkToken} = require("../controllers/plaidController.js");

router.post('/createLinkToken', createLinkToken),


module.exports = router;
