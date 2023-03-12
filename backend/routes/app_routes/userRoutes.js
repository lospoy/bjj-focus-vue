const express = require('express')
const router = express.Router()
const { registerUser, loginUser, updateUser, getMe } = require('../../controllers/app_controllers/userController')
const { protect } = require('../../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.put('/:id', protect, updateUser)
router.get('/me', protect, getMe)

module.exports = router