const express = require('express')
const router = express.Router()
const { savePosition, getPosition, getAllPositions } = require('../../controllers/bjj_controllers/positionController')
const { protect } = require('../../middleware/authMiddleware')

router.post('/', protect, savePosition)
router.get('/:id', protect, getPosition)
router.get('/', protect, getAllPositions)

module.exports = router