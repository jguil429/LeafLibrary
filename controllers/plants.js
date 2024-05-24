const Plant = require('../models/plant');
const Image = require('../models/image');
const { cloudinary } = require('../cloudinary');
// const dateHelper = require('../utils/dateHelper');
// const { DateTime } = require("luxon");
const {isString} = require("@cloudinary/url-gen/internal/utils/dataStructureUtils");
const {setDefaultISOStringFields} = require("../utils/dateHelper");


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
    // console.log(DateTime.now().toLocaleString());
    const plant = await Plant.findById(req.params.id).populate({
        path: 'updates',
        populate: {
            path: 'author'
        }
     }).populate('author').populate('images');

    // const formattedDate = dateHelper.formatDate(plant.date_planted);
    console.log(DateTime.fromJSDate(plant.date_planted));
    const formattedDate = DateTime.fromJSDate(plant.date_planted).toLocaleString();

    if(!plant){
        req.flash('error', 'Plant not found.');
        return res.redirect('/plants');
    }

    res.render('plants/show', { plant, formattedDate });
};

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const plant = await Plant.findById(id).populate('images');
    if(!plant) {
        req.flash('error', 'Plant not found.');
        return res.redirect('/plants');
    }

    res.render('plants/edit', { plant });
};

module.exports.updatePlant = async (req, res) => {
    const { id } = req.params;
    const plant = await Plant.findById(id);

    // Update plant details
    plant.common_name = req.body.plant.common_name;
    plant.scientific_name = req.body.plant.scientific_name;
    plant.duration = req.body.plant.duration;
    plant.date_planted = req.body.plant.date_planted;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
        const newImages = await Promise.all(
            req.files.map(async (f) => {
                const image = new Image({ url: f.path, filename: f.filename });
                await image.save();
                return image._id;
            })
        );

        plant.images.push(...newImages);
    }

    // Handle image deletions
    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
        const imagesToDelete = await Image.find({ filename: { $in: req.body.deleteImages } });

        for (let image of imagesToDelete) {
            await cloudinary.uploader.destroy(image.filename);
            plant.images.pull(image._id);
        }
    }

    await plant.save();

    req.flash('success', `Successfully edited plant.`);
    res.redirect(`/plants/${plant._id}`);
};

module.exports.deletePlant = async (req, res) => {
    const { id } = req.params;
    await Plant.findByIdAndDelete(id);
    req.flash('success', 'Deleted a plant.');
    res.redirect('/plants');
};