const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const updateSchema = new Schema ({
    body: String,
    health: Number
});

module.exports = mongoose.model("Update", updateSchema);