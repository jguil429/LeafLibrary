const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema ({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/c_auto,g_auto,h_380,w_490');
});

ImageSchema.virtual('library_card').get(function() {
    return this.url.replace('/upload', '/upload/c_auto,g_auto,h_275,w_360');
});

module.exports = mongoose.model('Image', ImageSchema);