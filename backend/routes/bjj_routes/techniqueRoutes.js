const express = require('express')
const router = express.Router()
const { saveTechnique, getTechnique, updateTechnique, getAllTechniques } = require('../../controllers/bjj_controllers/techniqueController')
const { protect } = require('../../middleware/authMiddleware')

router.post('/', protect, saveTechnique)
router.get('/id/:id', protect, getTechnique)
router.put('/id/:id', protect, updateTechnique)
router.get('/', protect, getAllTechniques)

module.exports = router