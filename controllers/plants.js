const Plant = require('../models/plant');
const Image = require('../models/image');
const { cloudinary } = require('../cloudinary');

module.exports.library = async(req, res) => {
    const plants = await Plant.find().populate('images');
    const placeholder = await Image.findOne({filename: 'LeafLibrary_placeholder'})

    res.render('plants/library', {plants, placeholder});
};

module.exports.myPlants = async(req, res) => {
    const plants = await Plant.find({author: req.user._id}).populate('images');
    const placeholder = await Image.findOne({filename: 'LeafLibrary_placeholder'})

    res.render('plants/myplants', {plants, placeholder});
};

module.exports.renderNewForm = (req, res) => {
    res.render('plants/new'); 
 };

//  module.exports.createPlant = async (req, res, next) => {
//     const plant = new Plant(req.body.plant);
//     plant.images = req.files.map(f => ({url: f.path, filename: f.filename}));
//     plant.author = req.user._id;
//     await plant.save();
//     req.flash('success', 'Successfully added a new plant!');
//     res.redirect(`/plants/${plant._id}`);
// };

module.exports.createPlant = async (req, res, next) => {
    try {
        const plant = new Plant(req.body.plant);
        const images = await Promise.all(
            req.files.map(async (f) => {
                const image = new Image({ url: f.path, filename: f.filename });
                await image.save();
                return image._id;
            })
        );
        plant.images = images;
        plant.author = req.user._id;
        await plant.save();
        req.flash('success', 'Successfully added a new plant!');
        res.redirect(`/plants/${plant._id}`);
    } catch (err) {
        next(err);
    }
};

module.exports.showPlant = async(req, res) => {
    const plant = await Plant.findById(req.params.id).populate({
        path: 'updates',
        populate: {
            path: 'author'
        }
     }).populate('author').populate('images');

    if(!plant){
        req.flash('error', 'Plant not found.');
        return res.redirect('/plants');
    }

    res.render('plants/show', { plant });
};

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const plant = await Plant.findById(id);
    if(!plant) {
        req.flash('error', 'Plant not found.');
        return res.redirect('/plants');
    }
    res.render('plants/edit', { plant });
};

module.exports.updatePlant = async (req, res) => {
    const { id } = req.params;
    const plant = await Plant.findByIdAndUpdate(id, {...req.body.plant});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    plant.images.push(...imgs);
    await plant.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
       await plant.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    };
    req.flash('success', `Successfully edited plant.`)
    res.redirect(`/plants/${plant._id}`);
};

module.exports.deletePlant = async (req, res) => {
    const { id } = req.params;
    await Plant.findByIdAndDelete(id);
    req.flash('success', 'Deleted a plant.');
    res.redirect('/plants');
};