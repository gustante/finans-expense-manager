const router = require('express').Router();

const {postType, getAllTypes, deleteType} = require("../controllers/typeController.js");

const {typeValidator} = require('../validator.js');

router.post('/', typeValidator, postType) 
.get('/all', getAllTypes)
.delete('/', typeValidator, deleteType)

module.exports = router;
