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
    await User.deleteMany({});

    const testUser = new User({
        username: 'testuser',
        email: 'testuser@example.com'
    });
    await testUser.save();

    const seedImages = [
        "https://res.cloudinary.com/dpblveo9k/image/upload/v1712788124/LeafLibrary/btakq1nacknwalruc8qx.jpg",
        "https://res.cloudinary.com/dpblveo9k/image/upload/v1712788124/LeafLibrary/efuwplf5f9gphcl0guao.jpg",
        "https://res.cloudinary.com/dpblveo9k/image/upload/v1712583766/LeafLibrary/dvukzxwzqd7f8cm1u2yn.jpg",
        "https://res.cloudinary.com/dpblveo9k/image/upload/v1712582502/LeafLibrary/tztbyiusbhfljtkv8fxd.jpg",
        "https://res.cloudinary.com/dpblveo9k/image/upload/v1712245923/LeafLibrary/wdgg5oe7bvo7yzqfabs7.jpg"
    ]

    const resize = 'c_auto,g_auto,h_380,w_490'

    for (let i = 0; i < 5; i++) {
        const p = new Plant({
            author: testUser,
            scientific_name: `${sample(genus)} ${sample(species)}`,
            common_name: 'plant',
            duration: 'perennial',
            images: [
              {
                url: seedImages[i].replace('upload/', 'upload/c_auto,g_auto,h_380,w_490/'),
                filename: `LeafLibrary_${i}`
              }
            ]
        }) 
        await p.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});