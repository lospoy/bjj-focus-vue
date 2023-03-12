const asyncHandler = require('express-async-handler')
const FocusLesson = require('../../models/bjj_models/focusLessonModel')


// @desc    Save new focusLesson
// @route   POST /api/focusLessons/create
// @access  Public
const saveFocusLesson = asyncHandler(async (req, res) => {
    const { 
        topic,
        content: { techniques }
    } = req.body

    if (!topic || !techniques) {
        res.status(400)
        throw new Error('Please fill in all fields')
    }

    // Check if focusLesson exists
    const focusLessonExists = await FocusLesson.findOne({ topic, content: { techniques }})

    if (focusLessonExists) {
        res.status(400)
        throw new Error(`FocusLesson on ${topic} with those techniques already exists`)
    }

    // ************ TBD
    // Check for user permission to save focusLesson
    // Must be admin or techniques
    // const isAdmin = req.user.role.admin === true
    // const isTeacher = req.user.role.techniques === true    
    // if(isAdmin || isTeacher) {}
  
    // Create focusLesson
    const focusLesson = await FocusLesson.create({
        topic: req.body.topic,
        content: {
            techniques: req.body.content.techniques,
        },
        createdBy: req.user.id
    })
    if (focusLesson) {
        res.status(201).json({
            _id: focusLesson.id,
            topic: focusLesson.topic,
            content: {
                techniques: focusLesson.content.techniques,
            },
            createdBy: req.user.id
        })
    } else {
        res.status(400)
        throw new Error('Invalid focusLesson data')
    }
})

// @desc    Get specific focusLesson data
// @route   GET /api/focusLessons/:id
// @access  Public
const getFocusLesson = asyncHandler(async (req, res) => {
    const focusLesson = await FocusLesson.findById(req.params.id)

    if(!focusLesson) {
        res.status(400)
        throw new Error('FocusLesson not found')
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
        res.status(200).json(focusLesson)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})

// @desc    Get all focusLessons
// @route   GET /api/focusLessons
// @access  Public
const getAllFocusLessons = asyncHandler(async (req, res) => {
    const allFocusLessons = await FocusLesson.find({})
    res.status(200).json(allFocusLessons)
})

// @desc    Update focusLesson data
// @route   PUT /api/focusLessons/update/:id
// @access  Public
const updateFocusLesson = asyncHandler(async (req, res) => {
    const focusLesson = await FocusLesson.findById(req.params.id)

    if(!focusLesson) {
        res.status(400)
        throw new Error('FocusLesson not found')
    }
    
    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Check for user permission to update focusLesson
    // Must be admin, techniques, or the user's focusLesson
    const isAdmin = req.user.role.admin === true
    const isTeacher = req.user.role.techniques === true
    const studentIsUser = focusLesson.user ? focusLesson.user.toString() : ''
    const isTheStudentItself = studentIsUser === req.user.id
    

    if( isAdmin || isTeacher || isTheStudentItself ) {
            const updatedFocusLesson = await FocusLesson.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            res.status(200).json(updatedFocusLesson)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})


module.exports = {
    saveFocusLesson,
    getFocusLesson,
    getAllFocusLessons,
    updateFocusLesson,
}