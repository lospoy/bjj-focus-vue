const express = require('express')
const router = express.Router()
const { registerHuman, getHuman, updateHuman, getAllHumans, getAllActiveHumans, getAllInactiveHumans } = require('../controllers/humanController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, registerHuman)
router.put('/:id', protect, updateHuman)
router.get('/active', protect, getAllActiveHumans)
router.get('/inactive', protect, getAllInactiveHumans)
router.get('/:id', protect, getHuman)
router.get('/', protect, getAllHumans)

module.exports = router