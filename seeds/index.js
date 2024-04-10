const mongoose = require('mongoose');
const {genus, species} = require('./seedhelpers');
const Plant = require('../models/plant');
const User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/plantlib');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Plant.deleteMany({});

    const testUser = new User({
        username: 'testuser',
        email: 'testuser@example.com'
    });
    await testUser.save();

    for (let i = 0; i < 5; i++) {
        const p = new Plant({
            author: testUser,
            scientific_name: `${sample(genus)} ${sample(species)}`,
            common_name: 'plant',
            duration: 'perennial',
            images: [
              {
                url: 'https://res.cloudinary.com/dpblveo9k/image/upload/v1712770816/LeafLibrary/dveiqux0gflqcvk8nphp.jpg',
                filename: 'LeafLibrary/dveiqux0gflqcvk8nphp'
              }
              ]
        }) 
        await p.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});