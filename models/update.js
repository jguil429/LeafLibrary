const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const updateSchema = new Schema ({
    body: String,
    health: Number,
    timestamp: Date,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Update", updateSchema);