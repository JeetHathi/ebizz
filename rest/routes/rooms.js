import { Router } from 'express'
import passport from 'passport'
import { User } from '../models/Users.js'

const router = Router()

router.get('/', (req, res, next) => {
    let body = req.body
    console.log('body: ', body)
    console.log('body toString: ', JSON.stringify(body))

    if (body.email == null || body.name == null || body.password == null) {
        return res.status(400).json({ info: 'Missing body email, name or password' })
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(400).json({ errors: err, info: 'Unable to create user' })
        }
        if (!user) {
            return res.status(400).json({ errors: err, info: 'null user' })
        }
        User.findByIdAndUpdate(user._id, { name: body.name }, (err, docs) => {
            if (err) {
                return res.status(500).json({ errors: err, info: 'Unable to set name' })
            }
        })
        req.logIn(user, err => {
            if (err) {
                return res.status(400).json({ errors: err, info: 'login failed' })
            }
            return res.status(200).json({info: 'user created and logged in'})
        })
        console.log('user', JSON.stringify(user))
    })(req, res, next)
})

router.post('/login', (req, res, next) => {
    console.log('Posted login')
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(400).json({ errors: err })
        }
        if (!user) {
            return res.status(400).json({ errors: err, info: 'Either no user found, or incorrect username and password' })
        }
        req.logIn(user, err => {
            if (err) {
                return res.status(400).json({ errors: err, info: 'Login failed' })
            }
            return res.status(200).json({ success: `logged in ${req.user.id}` })
        })
    })(req, res, next)
})

export default router
