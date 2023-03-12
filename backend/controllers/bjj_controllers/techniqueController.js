const asyncHandler = require('express-async-handler')
const Technique = require('../../models/bjj_models/techniqueModel')

// @desc    Save new technique
// @route   POST /api/techniques
// @access  Public
const saveTechnique = asyncHandler(async (req, res) => {
    const { 
        position,
        move,
        variation,
        notes
    } = req.body

    if (!position || !move) {
        res.status(400)
        throw new Error('Please fill in position and move')
    }

    // Check if technique exists
    const techniqueExists = await Technique.findOne({ position: position, move: move, variation: variation })

    if (techniqueExists) {
        res.status(400)
        throw new Error(`Technique ${position} ${move} ${variation} already exists`)
    }

    // ************ TBD
    // Check for user permission to save technique
    // Must be admin or teacher
    // const isAdmin = req.user.role.admin === true
    // const isTeacher = req.user.role.teacher === true    
    // if(isAdmin || isTeacher) {}
  
    // Create technique
    const technique = await Technique.create({
        position: req.body.position,
        move: req.body.move,
        variation: req.body.variation,
        notes: req.body.notes,
        createdBy: req.user.id
    })
    if (technique) {
        res.status(201).json({
            _id: technique.id,
            position: technique.position._id,
            move: technique.move._id,
            variation: technique.variation._id,
            variation: technique.notes,
            createdBy: req.user.id
        })
    } else {
        res.status(400)
        throw new Error('Invalid technique data')
    }
})

// @desc    Get specific technique data
// @route   GET /api/techniques/id/:id
// @access  Private
const getTechnique = asyncHandler(async (req, res) => {
    const technique = await Technique.findById(req.params.id)

    if(!technique) {
        res.status(400)
        throw new Error('Technique not found')
    }

    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Check for user permission to GET technique data
    const isAdmin = req.user.role.admin
    const isTeacher = req.user.role.teacher
    const isStudent = req.user.role.student

    if(isAdmin || isTeacher || isStudent) {
        res.status(200).json(technique)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})

// @desc    Get all techniques
// @route   GET /api/techniques
// @access  Private
const getAllTechniques = asyncHandler(async (req, res) => {
    const allTechniques = await Technique.find({})

    // Check for user permission to GET technique data
    // Must be admin, teacher, or the user's technique
    const isAdmin = req.user.role.admin
    const isTeacher = req.user.role.teacher
    const isStudent = req.user.role.student

    if(isAdmin || isTeacher || isStudent) {
        res.status(200).json(allTechniques)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})

// @desc    Update technique data
// @route   PUT /api/techniques/:id
// @access  Private
const updateTechnique = asyncHandler(async (req, res) => {
    const technique = await Technique.findById(req.params.id)

    if(!technique) {
        res.status(400)
        throw new Error('Technique not found')
    }
    
    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Check for user permission to update technique
    // Must be admin, teacher, or the user's technique
    const isAdmin = req.user.role.admin === true
    const isTeacher = req.user.role.teacher === true
    const studentIsUser = technique.user ? technique.user.toString() : ''
    const isTheStudentItself = studentIsUser === req.user.id
    

    if( isAdmin || isTeacher || isTheStudentItself ) {
            const updatedTechnique = await Technique.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            res.status(200).json(updatedTechnique)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})

module.exports = {
    saveTechnique,
    getTechnique,
    getAllTechniques,
    updateTechnique,
}