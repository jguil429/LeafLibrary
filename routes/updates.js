const express = require('express');
const router = express.Router({ mergeParams: true });

const Plant = require('../models/plant');
const Update = require('../models/update');

const { updateSchema } = require('../schemas.js');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const validateUpdate = (req, res, next) => {
    const {error} = updateSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

router.post('/', validateUpdate, catchAsync(async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    const update = new Update(req.body.update);
    plant.updates.push(update);
    await update.save();
    await plant.save();
    req.flash('success', 'Added a plant care update!');
    res.redirect(`/plants/${plant._id}`);
}));

router.delete('/:updateId', catchAsync(async (req,res) => {
    const { id, updateId } = req.params;
    await Plant.findByIdAndUpdate(id, {$pull : {updates: updateId}})
    await Update.findByIdAndDelete(updateId);
    req.flash('success', 'Deleted a plant care update.');
    res.redirect(`/plants/${id}`);
}));

module.exports = router;