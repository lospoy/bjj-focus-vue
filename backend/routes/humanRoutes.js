const express = require('express')
const router = express.Router()
const { registerHuman, getHuman, updateHuman, getAllHumans } = require('../controllers/humanController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, registerHuman)
router.put('/:id', protect, updateHuman)
router.get('/:id', protect, getHuman)
router.get('/', protect, getAllHumans)

module.exports = router