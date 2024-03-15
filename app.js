const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Plant = require('./models/plant');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/plantlib');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Connected")
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/plants', catchAsync(async(req, res) => {
    const plants = await Plant.find({});
    res.render('plants/library', {plants});
}));

app.get('/plants/new', (req, res) => {
    res.render('plants/new');
});

app.post('/plants', catchAsync(async (req, res) => {
    if(!req.body.plant) throw new ExpressError("Missing Plant Data", 400);
    const plant = new Plant(req.body.plant);
    await plant.save();
    res.redirect(`/plants/${plant._id}`);
}));

app.get('/plants/:id', catchAsync(async(req, res) => {
    const plant = await Plant.findById(req.params.id);
    res.render('plants/show', { plant });
}));

app.get('/plants/:id/edit', catchAsync(async(req, res) => {
    const plant = await Plant.findById(req.params.id);
    res.render('plants/edit', { plant });
}));

app.put('/plants/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const plant = await Plant.findByIdAndUpdate(id, {...req.body.plant});
    res.redirect(`/plants/${plant._id}`);
}));

app.delete('/plants/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Plant.findByIdAndDelete(id);
    res.redirect('/plants');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
        if(!err.message) err.message = "Problem Detected";
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('Port 3000')
});