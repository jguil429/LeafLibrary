const Plant = require('../models/plant');
const Update = require('../models/update');

module.exports.createUpdate = async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    const update = new Update(req.body.update);
    update.author = req.user._id;
    plant.updates.push(update);
    await update.save();
    await plant.save();
    req.flash('success', 'Added a plant care update!');
    res.redirect(`/plants/${plant._id}`);
};

module.exports.deleteUpdate = async (req,res) => {
    const { id, updateId } = req.params;
    await Plant.findByIdAndUpdate(id, {$pull : {updates: updateId}})
    await Update.findByIdAndDelete(updateId);
    req.flash('success', 'Deleted a plant care update.');
    res.redirect(`/plants/${id}`);
};