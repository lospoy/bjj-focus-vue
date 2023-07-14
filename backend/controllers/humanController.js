const asyncHandler = require('express-async-handler')
const Human = require('../models/humanModel')

// @desc    Register new human
// @route   POST /api/humans
// @access  Public
const registerHuman = asyncHandler(async (req, res) => {
  // trainingStatus active by default for new humans
  const {
    name: { first, last }
  } = req.body

  if (!first || !last) {
    res.status(400)
    throw new Error('Please fill in all fields')
  }

  // Check if human exists
  const humanExists = await Human.findOne({ name: { first, last } })

  if (humanExists) {
    res.status(409)
    throw new Error(`Human with name ${first} ${last} already exists`)
  }

  // Create human
  const human = await Human.create({
    name: {
      first,
      last
    },
    trainingStatus: {
      active: true
    },
    createdBy: req.user.id
  })

  // Check for user permission
  const isAdmin = req.user.role.admin === true
  const isTeacher = req.user.role.teacher === true

  if ((human && isAdmin) || (human && isTeacher)) {
    res.status(201).json({
      _id: human.id,
      name: {
        first: human.name.first,
        last: human.name.last
      },
      trainingStatus: {
        active: true
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

  if (!human) {
    res.status(400)
    throw new Error('Human not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Check for user permission
  if (req.user) {
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

  // Check for user permission
  const isAdmin = req.user.role.admin === true
  const isTeacher = req.user.role.teacher === true

  if (isAdmin || isTeacher) {
    res.status(200).json(allHumans)
  } else {
    res.status(401)
    throw new Error('User not authorized')
  }
})

// @desc    Get all humans with trainingStatus.active
// @route   GET /api/humans/active
// @access  Private
const getAllActiveHumans = asyncHandler(async (req, res) => {
  const allActiveHumans = await Human.find({
    trainingData: {
      status: {
        active: true
      }
    }
  })

  // Check for user permission
  const isAdmin = req.user.role.admin === true
  const isTeacher = req.user.role.teacher === true

  if (isAdmin || isTeacher) {
    res.status(200).json(allActiveHumans)
  } else {
    res.status(401)
    throw new Error('User not authorized')
  }
})

// @desc    Get all humans with NOT trainingStatus.active
// @route   GET /api/humans/inactive
// @access  Private
const getAllInactiveHumans = asyncHandler(async (req, res) => {
  const inactiveHumans = await Human.find({
    $or: [
      { trainingData: { $exists: false } },
      { 'trainingData.status.active': { $ne: true } }
    ]
  })

  // Check for user permission
  const isAdmin = req.user.role.admin === true
  const isTeacher = req.user.role.teacher === true

  if (isAdmin || isTeacher) {
    res.status(200).json(inactiveHumans)
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

  if (!human) {
    res.status(400)
    throw new Error('Human not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Check for user permission to update human
  // Must be admin, teacher, or the user's human
  const isAdmin = req.user.role.admin === true
  const isTeacher = req.user.role.teacher === true
  const studentIsUser = human.user ? human.user.toString() : ''
  const isTheStudentItself = studentIsUser === req.user.id

  if (isAdmin || isTeacher || isTheStudentItself) {
    const updatedHuman = await Human.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    )
    res.status(200).json(updatedHuman)
  } else {
    res.status(401)
    throw new Error('User not authorized')
  }
})

module.exports = {
  registerHuman,
  getHuman,
  getAllHumans,
  getAllActiveHumans,
  getAllInactiveHumans,
  updateHuman
}
