const router = require('express').Router();

const {postType, getAllTypes, deleteType, updateType} = require("../controllers/typeController.js");

const {typeValidator, typeUpdateValidator} = require('../validator.js');

router.post('/', typeValidator, postType)
.get('/all', getAllTypes)
.delete('/', typeValidator, deleteType)
.put('/', typeUpdateValidator, updateType)

module.exports = router;
