const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Update = require('./update')

const PlantSchema = new Schema({
    common_name: String,
    scientific_name: String,
    image: String,
    duration: String,
    date_planted: String,
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