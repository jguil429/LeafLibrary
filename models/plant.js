const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantSchema = new Schema({
    common_name: String,
    scientific_name: String,
    image: String,
    duration: String,
    date_planted: String,
    
})

module.exports = mongoose.model('Plant', PlantSchema);