const express = require('express')
const router = express.Router()
const { saveFocusLesson, getFocusLesson, getAllFocusLessons, updateFocusLesson } = require('../../controllers/bjj_controllers/focusLessonController')
const { protect } = require('../../middleware/authMiddleware')

router.get('/', protect, getAllFocusLessons)
router.post('/create', protect, saveFocusLesson)
router.put('/update/:id', protect, updateFocusLesson)
router.get('/:id', protect, getFocusLesson)

module.exports = router