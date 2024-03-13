const mongoose = require('mongoose');
const {genus, species} = require('./seedhelpers');
const Plant = require('../models/plant');

mongoose.connect('mongodb://localhost:27017/plantlib');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Plant.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const p = new Plant({
            scientific_name: `${sample(genus)} ${sample(species)}`,
            common_name: 'plant',
            image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTN8MjM5ODgxNXx8ZW58MHx8fHx8',
            duration: 'perennial'
        }) 
        await p.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});