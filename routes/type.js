const router = require('express').Router();

const {postType, getAllTypes} = require("../controllers/typeController.js");

const {typeValidator} = require('../validator.js');

router.post('/', typeValidator, postType) //posts new type
.get('/all', getAllTypes)

module.exports = router;
