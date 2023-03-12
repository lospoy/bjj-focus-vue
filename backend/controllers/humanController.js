const asyncHandler = require('express-async-handler')
const Human = require('../models/humanModel')
// const User = require('..models/app_models/userModel')


// @desc    Register new human
// @route   POST /api/humans
// @access  Public
const registerHuman = asyncHandler(async (req, res) => {
    // trainingStatus active by default for new humans
    const { 
        name: { first, last },
    } = req.body

    if (!first || !last) {
        res.status(400)
        throw new Error('Please fill in all fields')
    }

    // Check if human exists
    const humanExists = await Human.findOne({ name: { first, last } })

    if (humanExists) {
        res.status(400)
        throw new Error(`Human with name ${first} ${last} already exists`)
    }

    // Create human
    const human = await Human.create({
        name: {
            first, last
        },
        createdBy: req.user.id
    })

    if (human) {
        res.status(201).json({
            _id: human.id,
            name: {
                first: human.name.first,
                last: human.name.last
            },
            createdBy: req.user.id
        })
    } else {
        res.status(400)
        throw new Error('Invalid human data')
    }
})

// @desc    Get specific human data
// @route   GET /api/humans/:id
// @access  Private
const getHuman = asyncHandler(async (req, res) => {
    const human = await Human.findById(req.params.id)

    if(!human) {
        res.status(400)
        throw new Error('Human not found')
    }

    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Check for user permission to GET human data
    // Must be admin, teacher, or the user's human
    // **** Could be implemented later, as right now only your own ID can be passed in the request
    // const isAdmin = req.user.role.admin === true
    // const isTeacher = req.user.role.teacher === true
    // const isTheSameHuman = JSON.stringify(req.user.human) === req.params.id

    if(req.user) {
        res.status(200).json(human)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})

// @desc    Get all humans
// @route   GET /api/humans
// @access  Private
const getAllHumans = asyncHandler(async (req, res) => {
    const allHumans = await Human.find({})

    // Check for user permission to GET human data
    // Must be admin, teacher, or the user's human
    const isAdmin = req.user.role.admin === true
    const isTeacher = req.user.role.teacher === true

    if(isAdmin || isTeacher) {
        res.status(200).json(allHumans)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})

// @desc    Update human data
// @route   PUT /api/humans/:id
// @access  Private
const updateHuman = asyncHandler(async (req, res) => {
    const human = await Human.findById(req.params.id)

    if(!human) {
        res.status(400)
        throw new Error('Human not found')
    }
    
    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Check for user permission to update human
    // Must be admin, teacher, or the user's human
    const isAdmin = req.user.role.admin === true
    const isTeacher = req.user.role.teacher === true
    const studentIsUser = human.user ? human.user.toString() : ''
    const isTheStudentItself = studentIsUser === req.user.id

    if( isAdmin || isTeacher || isTheStudentItself ) {
            const updatedHuman = await Human.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            res.status(200).json(updatedHuman)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }

    // **************LATEST ACTION 22:45 08/30: UPDATE HUMAN
    // update doesnt add to the property of the object, it replaces the property of the object
    // expected is it ADDS to the property, not replace
    // unsure if this needs to be done client side
})


module.exports = {
    registerHuman,
    getHuman,
    getAllHumans,
    updateHuman,
}