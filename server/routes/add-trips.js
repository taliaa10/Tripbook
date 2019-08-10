const express = require('express')
const router = express.Router()

function authenticate(req, res, next) {
    if(req.session) {
        next()
    } else {
        res.redirect('/login')
    }
}


router.get('/', authenticate, (req, res) => {
    res.render('add-trips' , {})
})


router.post('/add-trips', (req, res) => {
    let tripTitle = req.session.tripTitle
    let tripImage = req.session.tripImage
    let departureDate = req.session.departureDate
    let returnDate = req.session.returnDate
    let id = req.session.id
    let username = user.username

    // let trip = new Trip()
    let trip = new Trip(tripTitle, tripImage, departureDate, returnDate, id, username)

    // Trip.addTrip(tripTitle, tripImage, departureDate, returnDate)

    trips.push(trip)
    console.log(trips)
    console.log(trip.id)
    res.redirect('/trips')
})


module.exports = router