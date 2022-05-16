const router = require('express').Router();
const {login, authFail, logout} = require("../controllers/oauthController.js");

router.get('/login', login),
router.get('/authFail', authFail)
router.get('/logout', logout),

module.exports = router;
