const express = require('express')
const router = express.Router()
const { saveSession, getSession, updateSession, getAllSessions } = require('../controllers/sessionController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, saveSession)
router.get('/:id', protect, getSession)
router.put('/:id', protect, updateSession)
router.get('/', protect, getAllSessions)

module.exports = router