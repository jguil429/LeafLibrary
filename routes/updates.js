const express = require('express');
const router = express.Router({ mergeParams: true });
const {validateUpdate, isLoggedIn, isUpdateAuthor} = require('../middleware');
const Plant = require('../models/plant');
const Update = require('../models/update');
const updates = require('../controllers/updates');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.post('/', isLoggedIn, validateUpdate, catchAsync(updates.createUpdate));

router.delete('/:updateId', isLoggedIn, isUpdateAuthor, catchAsync(updates.deleteUpdate));

module.exports = router;