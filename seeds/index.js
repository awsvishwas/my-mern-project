const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

const Campground = require('../models/campgrounds')
const imagelinks = require('./imagesUrl')


const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');


const sample = array => array[Math.floor(Math.random()* array.length)]

const seedDatabase = async () =>{
    await Campground.deleteMany({})

    for(let i =0;i<500;i++){
        const randomValue = Math.floor(Math.random()*1000)
        const randomPrice = Math.floor(Math.random()*50)
        const randomImageIndex = Math.floor(Math.random()*15)
        const title = `${sample(descriptors)} ${sample(places)}`
        const location = `${cities[randomValue].city}, ${cities[randomValue].state}`
        const url = imagelinks[randomImageIndex]
        const filename = `${title}-image-${url.slice(-5)}`
        const camp = new Campground({
            author: '660f9d0e54d925735c95e59f',
            location: location,
            title: title,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae incidunt ipsa, aperiam quis ipsum cupiditate? Error, porro animi quo voluptate ipsam veritatis itaque blanditiis odit consectetur. Sint itaque sequi delectus.',
            images: [{
                url: url,
                filename: filename
            }],
            price: randomPrice,
            geometry: {
                type: 'Point',
                coordinates: [cities[randomValue].longitude, cities[randomValue].latitude]
            }
        })

        await camp.save()
    }
}

seedDatabase().then(()=>{
    mongoose.connection.close()
})