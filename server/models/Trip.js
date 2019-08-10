let uniqid = require('uniqid')

class Trip {
    constructor(tripTitle, tripImage, departureDate, returnDate, id, username) {
        this.tripTitle = tripTitle
        this.tripImage = tripImage
        this.departureDate = departureDate
        this.returnDate = returnDate
        this.id  = uniqid()
        this.username = username
    }
}

module.exports = Trip