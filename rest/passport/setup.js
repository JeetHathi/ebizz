import bcrypt from 'bcryptjs'
import { User } from '../models/Users.js'
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

// Local Strategy
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    // Match User
    User.findOne({ email: email }).then(user => {
        if (!user) { // Create new User
            console.log('New user')
            const newUser = new User({ email, password })
            bcrypt.genSalt((err, salt) => { // Hash password before saving in database
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err
                    newUser.password = hash
                    newUser.save().then(user => { // Save user to db
                        console.log('Save successful')
                        return done(null, user)
                    }).catch(err => {
                        return done(null, false, { message: err })
                    })
                })
            })
        } else { // Return other user
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err

                if (isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: "Wrong password" })
                }
            })
        }
    }).catch(err => {
        return done(null, false, { message: err })
    })
}))

export default passport