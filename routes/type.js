const router = require('express').Router();

const {postType, getAllTypes, deleteType, updateType, updateSumOfExpenses} = require("../controllers/typeController.js");

const {typeValidator, typeUpdateValidator} = require('../validator.js');

router.post('/', typeValidator, postType)
.get('/all', getAllTypes)
.delete('/', typeValidator, deleteType)
.put('/', typeUpdateValidator, updateType)
.get('/updateSumOfExpenses', updateSumOfExpenses)

module.exports = router;
