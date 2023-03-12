const express = require('express')
const router = express.Router()
const { saveMove, getMove, getAllMoves } = require('../../controllers/bjj_controllers/moveController')
const { protect } = require('../../middleware/authMiddleware')

router.post('/', protect, saveMove)
router.get('/:id', protect, getMove)
router.get('/', protect, getAllMoves)

module.exports = router