const mongoose = require('mongoose');
const {genus, species} = require('./seedhelpers');
const Plant = require('../models/plant');
const User = require('../models/user');
const Image = require('../models/image');

mongoose.connect('mongodb://localhost:27017/plantlib');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedImages = [
    "https://res.cloudinary.com/dpblveo9k/image/upload/v1712788124/LeafLibrary/btakq1nacknwalruc8qx.jpg",
    "https://res.cloudinary.com/dpblveo9k/image/upload/v1712788124/LeafLibrary/efuwplf5f9gphcl0guao.jpg",
    "https://res.cloudinary.com/dpblveo9k/image/upload/v1712583766/LeafLibrary/dvukzxwzqd7f8cm1u2yn.jpg",
    "https://res.cloudinary.com/dpblveo9k/image/upload/v1712582502/LeafLibrary/tztbyiusbhfljtkv8fxd.jpg",
    "https://res.cloudinary.com/dpblveo9k/image/upload/v1712245923/LeafLibrary/wdgg5oe7bvo7yzqfabs7.jpg"
]

const seedDB = async() => {
    await Plant.deleteMany({});
    await User.deleteMany({});
    await Image.deleteMany({});

    // create User "test" attached as author to the 5 seeded plants
    const testUser = new User({
        username: 'testUser',
        email: 'test@gmail.com',
    });
    await testUser.setPassword('test@123');
    await testUser.save();

    // create User "jupe" for testing plant additions
    const jupeUser = new User({
        username: 'jupe',
        email: 'jupe@gmeow.com',
    });
    await jupeUser.setPassword('jupe@123');
    await jupeUser.save();

    // create and save the images
    const plantImages = [];
    // for (let i = 0; i < 5; i++) {
    //     const resize = 'upload/c_auto,g_auto,h_380,w_490';
    //     const image = new Image({
    //         url: seedImages[i].replace('upload/', resize),
    //         filename: `LeafLibrary_${i}`,
    //     });
    //     await image.save();
    // }

    // create and save the plants, associating the images
    for (let i = 0; i < 5; i++) {
        const resize = 'upload/c_auto,g_auto,h_380,w_490';
        const image = new Image({
            url: seedImages[i].replace('upload/', resize),
            filename: `LeafLibrary_${i}`,
        });
        await image.save();

        const p = new Plant({
            author: testUser,
            scientific_name: `${sample(genus)} ${sample(species)}`,
            common_name: 'plant',
            duration: 'perennial',
            images: image
        });
        await p.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});