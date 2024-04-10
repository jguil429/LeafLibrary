const express = require('express');
const router = express.Router();
const plants = require('../controllers/plants');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validatePlant} = require('../middleware.js');
const Plant = require('../models/plant');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(plants.library))
    .post(isLoggedIn, upload.array('image'), validatePlant, catchAsync(plants.createPlant));

router.get('/new', isLoggedIn, plants.renderNewForm);

router.get('/myplants', isLoggedIn, catchAsync(plants.myPlants));

router.route('/:id')
    .get(catchAsync(plants.showPlant))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePlant, catchAsync(plants.updatePlant))
    .delete(isLoggedIn, isAuthor, catchAsync(plants.deletePlant));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(plants.renderEditForm));

module.exports = router;
