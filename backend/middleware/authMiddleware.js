// middleware are functions that execute during the req, res cycle
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/app_models/userModel')

// middleware requires req, res, AND 'next'

const protect = asyncHandler(async (req, res, next) => {
    let token

    // we're checking for an authorization object in the HTTP headers
    // header looks like 'Bearer tqsfiasfjaksfno' so we'll check that starts with 'Bearer'
    if  (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
        ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user id (payload) from the token
            // @route   /controllers/userController     #v667
            // .select('-password')     removes password
            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = { protect }
