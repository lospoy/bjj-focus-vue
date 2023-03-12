const express = require('express')
const router = express.Router()
const { getMetrics, saveMetric, updateMetric, deleteMetric } = require('../../controllers/app_controllers/appMetricController')
const { protect } = require('../../middleware/authMiddleware')

// only needs '/' because /app/appMetrics is already specified in /server.js
// @route   /controllers/appMetricController

// A -> router.get('/', getPrices)
// B -> router.post('/', savePrice)
// line below chains A and B
router.route('/').get(protect, getMetrics).post(protect, saveMetric)
router.route('/:id').put(protect, updateMetric).delete(protect, deleteMetric)

module.exports = router