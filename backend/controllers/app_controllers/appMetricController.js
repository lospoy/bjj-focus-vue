// using async since mongoose returns a promise
// Error hanlder via 'express-async-handler' instead of try-catch

const asyncHandler = require('express-async-handler')
const AppMetric = require('../../models/app_models/appMetricModel')

// @desc    Get appMetrics
// @route   GET /api/appMetrics
// @access  Private
const getMetrics = asyncHandler(async (req, res) => {
    const metrics = await AppMetric.find({ user: req.user.id })

    res.status(200).json(metrics)
})

// @desc    Save appMetrics
// @route   POST /api/appMetrics
// @access  Private
const saveMetric = asyncHandler(async (req, res) => {
    // #c301 >> to use body data you need to add middleware in /server.js 

    if(!req.body.appMetric) {
        res.status(400)
        throw new Error('Please add app Metrics')
    }

    const metric = await AppMetric.create({
        // @route /models/app_models/appMetricModel
        time: {
            lastSession: req.body.time.lastSession,
            totalUsageDuration: req.body.time.totalUsageDuration,
            averageUsageLength: req.body.time.averageUsageLength
        },
        timesOpened: req.body.timesOpened,
        device: req.body.device,
    })

    res.status(200).json(metric)
})

// @desc    Update appMetric
// @route   PUT /api/appMetrics/:id
// @access  Private
const updateMetric = asyncHandler(async (req, res) => {
    const metric = await AppMetric.findById(req.params.id)

    if(!metric) {
        res.status(400)
        throw new Error('Metric not found')
    }

    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure logged in user matches the price user
    if(metric.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedMetric = await AppMetric.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedMetric)
})

// @desc    Delete appMetric
// @route   DELETE /api/appMetrics/:id
// @access  Private
const deleteMetric = asyncHandler(async (req, res) => {
    const price = await AppMetric.findById(req.params.id)

    if(!price) {
        res.status(400)
        throw new Error('Price not found')
    }

    // Check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure logged in user matches the price user
    if(price.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await price.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getMetrics,
    saveMetric,
    updateMetric,
    deleteMetric
}
