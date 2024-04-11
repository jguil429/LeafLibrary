const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Update = require('./update')

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

const PlantSchema = new Schema({
    common_name: String,
    scientific_name: String,
    images: [ImageSchema],
    duration: String,
    date_planted: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updates: [
        {
            type: Schema.Types.ObjectId,
            ref :"Update"
        }
    ]
    
});

PlantSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Update.deleteMany({
            _id: {
                $in: doc.updates
            }
        })
    }
})

module.exports = mongoose.model('Plant', PlantSchema);