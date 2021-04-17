import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import passport from './passport/setup.js'
import auth from './routes/auth.js'

const app = express()
const port = 5000
const MONGO_URI = 'mongodb+srv://admin:adminadminadmin@cluster0.if84e.mongodb.net/db?retryWrites=true&w=majority'

mongoose.connect(MONGO_URI)
    .then(console.log(`MongoDB connected to ${MONGO_URI}`))
    .catch(err => console.log('MongoDB connection error: ', err))

app.use(express.json())
app.use(express.urlencoded())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', auth)
app.get("/", (req, res) => res.send("Good morning sunshine!"))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
