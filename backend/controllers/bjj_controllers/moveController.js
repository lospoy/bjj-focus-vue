const asyncHandler = require('express-async-handler')
const Move = require('../../models/bjj_models/moveModel')

// @desc    Save new move
// @route   POST /api/techniques/moves
// @access  Public
const saveMove = asyncHandler(async (req, res) => {
    const { name, category } = req.body

    if (!name || !category) {
        res.status(400)
        throw new Error('Please fill in all fields')
    }

    // Check if move exists
    const moveExists = await Move.findOne({ name: name, category: category })

    if (moveExists) {
        res.status(400)
        throw new Error(`Move ${name} ${category} already exists`)
    }

    // ************ TBD
    // Check for user permission to save move
    // Must be admin or teacher
    // const isAdmin = req.user.role.admin === true
    // const isTeacher = req.user.role.teacher === true    
    // if(isAdmin || isTeacher) {}
  
    // Create move
    const move = await Move.create({
        name: req.body.name,
        category: req.body.category,
        createdBy: req.user.id
    })
    if (move) {
        res.status(201).json({
            _id: move.id,
            name: move.name,
            category: move.category,
            createdBy: req.user.id
        })
    } else {
        res.status(400)
        throw new Error('Invalid technique data')
    }
})

// @desc    Get specific move data
// @route   GET /api/techniques/moves/:id
// @access  Private
const getMove = asyncHandler(async (req, res) => {
    const move = await Move.findById(req.params.id)

    if(!move) {
        res.status(400)
        throw new Error('Move not found')
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
        res.status(200).json(move)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})

// @desc    Get all moves
// @route   GET /api/techniques/moves
// @access  Private
const getAllMoves = asyncHandler(async (req, res) => {
    const allMoves = await Move.find({})

    // Check for user permission to GET technique data
    // Must be admin, teacher, or the user's technique
    const isAdmin = req.user.role.admin
    const isTeacher = req.user.role.teacher
    const isStudent = req.user.role.student

    if(isAdmin || isTeacher || isStudent) {
        res.status(200).json(allMoves)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})

// ******************************************************************
// ******************************************************************
//                      VARIATION Controllers
// ******************************************************************
// ******************************************************************


module.exports = {
    saveMove,
    getMove,
    getAllMoves,
}