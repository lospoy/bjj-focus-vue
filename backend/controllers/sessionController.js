const asyncHandler = require('express-async-handler')
const Session = require('../models/sessionModel')
const User = require('../models/app_models/userModel')


// @desc    Save new session
// @route   POST /api/sessions
// @access  Public
const saveSession = asyncHandler(async (req, res) => {
    const { 
        when: { date },
        who: { teacher, students },
        what,
    } = req.body

    if (!date || !teacher || !students || !what) {
        res.status(400)
        throw new Error('Please fill in all fields')
    }

    // Check if session exists
    const sessionExists = await Session.findOne({ when: { date } })

    if (sessionExists) {
        res.status(400)
        throw new Error(`Session dated ${date} already exists`)
    }

    // ************ TBD
    // Check for user permission to save session
    // Must be admin or teacher
    // const isAdmin = req.user.role.admin === true
    // const isTeacher = req.user.role.teacher === true    
    // if(isAdmin || isTeacher) {}
  
    // Create session
    const session = await Session.create({
        when: {
            date: req.body.when.date
        },
        who: {
            teacher: req.body.who.teacher,
            students: req.body.who.students
        },
        what: req.body.what,
        createdBy: req.user.id
    })
    if (session) {
        res.status(201).json({
            _id: session.id,
            when: {
                date: session.when.date,
            },
            who: {
                teacher: session.who.teacher._id,
                students: session.who.students._id
            },
            what: session.what,
            createdBy: req.user.id
        })
    } else {
        res.status(400)
        throw new Error('Invalid session data')
    }
})

// @desc    Get specific session data
// @route   GET /api/sessions/:id
// @access  Private
const getSession = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id)

    if(!session) {
        res.status(400)
        throw new Error('Session not found')
    }

    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Check for user permission to GET session data
    // Must be admin, teacher, or the user's session
    const isAdmin = req.user.role.admin
    const isTeacher = req.user.role.teacher
    const studentIsUser = session.user ? session.user.toString() : ''
    const isTheStudentItself = studentIsUser === req.user.id

    if(isAdmin || isTeacher || isTheStudentItself) {
        res.status(200).json(session)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Private
const getAllSessions = asyncHandler(async (req, res) => {
    const allSessions = await Session.find({})

    // Check for user permission to GET session data
    // Must be admin or teacher
    const isAdmin = req.user.role.admin
    const isTeacher = req.user.role.teacher

    if(req.user) {
        res.status(200).json(allSessions)
    } else {
        res.status(401)
        throw new Error('User not authorized')
    }
})

// @desc    Update session data
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = asyncHandler(async (req, res) => {
    const session = await Session.findById(req.params.id)

    if(!session) {
        res.status(400)
        throw new Error('Session not found')
    }
    
    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Check for user permission to update session
    // Must be admin, teacher, or the user's session
    const isAdmin = req.user.role.admin === true
    const isTeacher = req.user.role.teacher === true
    const studentIsUser = session.user ? session.user.toString() : ''
    const isTheStudentItself = studentIsUser === req.user.id
    

    if( isAdmin || isTeacher || isTheStudentItself ) {
            const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            res.status(200).json(updatedSession)
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
    saveSession,
    getSession,
    getAllSessions,
    updateSession,
}