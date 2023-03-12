// here we define the user SCHEMA
const mongoose = require('mongoose')

// Replacing the industry-standard "Session" with "Metric" since the word session
// is already being used to refer to another model
const appMetricSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // Code below is not in use at the moment, dummy object for later on
        // time: {
        //     type: Object,
        //     required: true,
        //     properties: {
        //         lastSession: {
        //             type: Object,
        //             required: [true, 'At least 1 second required'],
        //             properties: {
        //                 date: Date,
        //                 duration: {
        //                     type: Number,
        //                     required: [true, 'At least 1 second required'],
        //                 }
        //             },
        //         },
        //         totalUsageDuration: {
        //             type: Number,
        //             required: [true, 'At least 1 second required'],
        //         },
        //         averageUsageLength: {
        //             type: Number,
        //             required: [true, 'Average required.']
        //         }
        //     }
        // },
        // timesOpened: {
        //     type: Number,
        //     required: [true, 'At least 1 time opened required.']
        // },
        // device: {
        //     type: Object,
        //     required: false
        // },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('AppMetric', appMetricSchema)
