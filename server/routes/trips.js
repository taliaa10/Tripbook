const express = require('express')
const router = express.Router()
const Trip = require('../models/Trip')
const session = require('express-session')
const formidable = require('formidable')
const uniqid = require('uniqid')

function authenticate(req, res, next) {
    if(req.session) {
        if(req.session.username)
        next()
    } else {
        res.redirect('/login')
    }
}


// router.get('/', (req, res) => {

//     let persistedUser = users.find(user => {
//         return user.username == username && user.password == password
//     })

//     if(persistedUser) {
//         if(req.session) {
//             res.render('add-trips' , {})
//         }
//     } else {
//         res.render('login')
//     }

    
// })

// router.get('/', authenticate, (req, res) => {
//     res.render('trips')
// })



// router.get('/', (req, res) => {
//     if(req.session) {
//         let tripTitle = req.session.tripTitle
//     }
//     res.render('trips', {trips: trips})
// })



router.get('/add-trips', (req, res) => {
    if(req.session) {
        req.session.tripTitle = req.body.tripTitle
    }
    res.render('add-trips')
})

router.post('/add-trips', (req, res) => {

    let tripTitle = req.body.tripTitle
    let tripImage = req.body.tripImage 
    let departureDate = req.body.departureDate
    let returnDate = req.body.returnDate
    let id = req.body.id
    let username = req.session.username

    // let trip = new Trip()
    let trip = new Trip(
        tripTitle, 
        tripImage, 
        departureDate, 
        returnDate, 
        id,
        username
        )

    trips.push(trip)
    console.log(trips)

    // put something in the session
    if(req.session) { // check if session is available
        req.session.tripTitle = req.body.tripTitle
        console.log(req.session.tripTitle)
    }

    res.redirect('/trips')
    // res.send('new trip added')
})

function uploadFile(req, callback) {
    new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
        uniqueFileName = `${uniqid()}.${file.name.split('.').pop()}`
        file.name = uniqueFileName
        file.path = __basedir + '/uploads/' + file.name
    })
    .on('file', (name, file) => {
        callback(file.name)
    })
}

router.post('/upload', (req, res) => {
    uploadFile(req, (tripImage) => {
        tripImage = `/uploads/${tripImage}`
        res.render('add-trips', {imageURL: tripImage})
    })
})

module.exports = router