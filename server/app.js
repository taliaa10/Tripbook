const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const http = require('http').Server(app)
const io = require('socket.io')(http)

const path = require('path')
const VIEWS_PATH = path.join(__dirname, '/views')
const session = require('express-session')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('views', VIEWS_PATH)
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))
app.set('view engine', 'mustache')
// app.engine('ejs', ejs(VIEWS_PATH + '/partials', '.ejs'))
// app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static('public/semantic'))
app.use('/uploads', express.static('uploads'))
app.use(session({
  secret: 'sas10001',
  resave: false,
  saveUninitialized: true
}))


// Socket connection for the chat
io.on('connection', (socket) => {
    console.log('you are connected')

    socket.on('Houston', (message) => {
        console.log(message)
        io.emit('Houston', message)
    })
})

app.get('/chat', (req, res) => {
    res.render('chat')
})

// classes
const Trip = require('./models/Trip')
const User = require('./models/User')

// Routers
const tripsRouter = require('./routes/trips')
app.use('/trips', tripsRouter)

global.__basedir = __dirname
global.trips = []
global.users = [{username: '10', password: '10', firstName: 'Taliaa', lastName: 'Webb'}, {username: '1', password: '1', firstName: 'Mary', lastName: 'Jane'}, {username: '2', password: '2', firstName: 'John', lastName: 'Smith'}]
//global.users = []

// home page
app.get('/', (req, res) => {
    res.render('index')
})

// authentication middleware
function authenticate(req, res, next) {
    if(req.session) {
        if(req.session.user) {
            next()
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}

// AUTHENTICATE ANYONE TRYING TO ACCESS TRIPS PROFILES
app.use('/trips', authenticate)

app.use((req, res, next) => {
    res.locals.user = req.session.user
    next()
})

// MY TRIPS/PROFILE PAGE
app.get('/trips', (req, res) => {
    let username = req.session.username
    let userTrips = trips.filter(trip => trip.username == username)
    res.render('trips', {userTrips: userTrips})
})

// REGISTER
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    let username = req.body.username 
    let password = req.body.password
    let firstName = req.body.firstName
    let lastName = req.body.lastName

    let checkUser = users.find(user => {
        return user.username == username
    })
    if(checkUser) {
        res.render('register', {message: 'That username is already taken.'})
    } else {
        let user = new User(username, password, firstName, lastName)
        users.push(user)
        res.redirect('/trips')
    }
})

// LOGIN
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {

    let username = req.body.username 
    let password = req.body.password

    // Checking the username and password the user typed in is in the user array / registered
    let persistedUser = users.find(user => {
        return user.username == username && user.password == password
    })
    // console.log(persistedUser)

    // put registered/logged in user in the session
    if (persistedUser) {
        if (req.session) {
            req.session.user = {firstName: persistedUser.firstName, username: persistedUser.username} 
        //    req.session.username = persistedUser.username
            res.redirect('/trips')
            // return req.session.user
        } 
    } else {
        res.render('login', {message: 'Invalid username or password'})
    }
})

// LOGOUT
app.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error) {
                next(error)
            } else {
                res.render('index', {loggedMessage:'You are now logged out.'})
            }
        })
    }
})

// delete trips
app.post(`/delete-trip`, (req, res) => {
    let id = req.body.id
    trips = trips.filter(trip => trip.id != id)
    res.redirect('/trips')
})

// confirmation page
app.get('/confirm', (req, res) => {
    res.render('confirm')
})

http.listen(port, () => {
    console.log(`TripBook server is running on port ${port}`)
})
