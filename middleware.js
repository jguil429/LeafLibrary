const {plantSchema, updateSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Plant = require('./models/plant');
const Update = require('./models/update.js');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in.');
        return res.redirect('/login');
    } 
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validatePlant = (req, res, next) => {
    const {error} = plantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const plant = await Plant.findById(id);
    if (!plant.author.equals(req.user._id)) {
        req.flash('error', 'Must be author to edit or delete plant.');
        return res.redirect(`/plants/${id}`);
    }
    next()
};

module.exports.isUpdateAuthor = async(req, res, next) => {
    const { id, updateId } = req.params;
    const update = await Update.findById(updateId);
    if (!update.author.equals(req.user._id)) {
        req.flash('error', 'Must be author to edit or delete plant.');
        return res.redirect(`/plants/${id}`);
    }
    next()
};

module.exports.validateUpdate = (req, res, next) => {
    const {error} = updateSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};