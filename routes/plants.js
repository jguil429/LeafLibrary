const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {plantSchema} = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Plant = require('../models/plant');

const validatePlant = (req, res, next) => {
    const {error} = plantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async(req, res) => {
    const plants = await Plant.find({});
    res.render('plants/library', {plants});
}));

router.get('/new', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('plants/new');
    } else {
        req.flash('error', 'You must be logged in to add a plant.');
        res.redirect('/login');
    }
});

router.post('/', validatePlant, catchAsync(async (req, res) => {
    const plant = new Plant(req.body.plant);
    await plant.save();
    req.flash('success', 'Successfully added a new plant!');
    res.redirect(`/plants/${plant._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const plant = await Plant.findById(req.params.id).populate('updates');
    if(!plant){
        req.flash('error', 'Plant not found.');
        return res.redirect('/plants');
    }
    res.render('plants/show', { plant });
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const plant = await Plant.findById(req.params.id);
    if(!plant){
        req.flash('error', 'Plant not found.');
        return res.redirect('/plants');
    }
    res.render('plants/edit', { plant });
}));

router.put('/:id', validatePlant, catchAsync(async (req, res) => {
    const { id } = req.params;
    const plant = await Plant.findByIdAndUpdate(id, {...req.body.plant});
    req.flash('success', `Successfully edited ${plant.common_name}.`)
    res.redirect(`/plants/${plant._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Plant.findByIdAndDelete(id);
    req.flash('success', 'Deleted a plant.');
    res.redirect('/plants');
}));

module.exports = router;
