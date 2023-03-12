const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../../models/app_models/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { 
        email,
        password,
        human,
        role
    } = req.body

    if (!email || !password || !human) {
        res.status(400)
        throw new Error('Please fill in all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error(`User with email ${email} already exists`)
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    // Create user
    const user = await User.create({
        email,
        password: hashedPassword,
        human: human,
        role: role
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            email: user.email,
            password: user.password,
            human: user.human._id,
            role: user.role,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email })

    // user.password is already hashed
    // compares unhashed with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            role: user.role,
            human: user.human._id
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

// @desc    Update user data
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    // Check for user
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedUser)
})

// Generate JWT
const generateToken = (id) => {
    // #v667    jwt.sign({ this is the payload })
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


module.exports = {
    registerUser,
    loginUser,
    updateUser,
    getMe,
}