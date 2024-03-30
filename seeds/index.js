const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

const Campground = require('../models/campgrounds')
const imagelinks = require('./imagesUrl')

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');


const sample = array => array[Math.floor(Math.random()* array.length)]

const seedDatabase = async () =>{
    await Campground.deleteMany({})

    for(let i =0;i<50;i++){
        const randomValue = Math.floor(Math.random()*1000)
        const randomPrice = Math.floor(Math.random()*50)
        const randomImageIndex = Math.floor(Math.random()*15)
        const camp = new Campground({
            location: `${cities[randomValue].city}, ${cities[randomValue].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae incidunt ipsa, aperiam quis ipsum cupiditate? Error, porro animi quo voluptate ipsam veritatis itaque blanditiis odit consectetur. Sint itaque sequi delectus.',
            image: imagelinks[randomImageIndex],
            price: randomPrice
        })

        await camp.save()
    }
}

seedDatabase().then(()=>{
    mongoose.connection.close()
})