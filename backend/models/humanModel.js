// here we define the user SCHEMA
const mongoose = require('mongoose')

const humanSchema = mongoose.Schema(

    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User',
        },
        name: {
            type: Object,
            required: [true, 'Name required'],
            properties: {
                first: {
                    type: String,
                    required: [true, 'name.firstName required'],
                },
                last: {
                    type: String,
                    required: [true, 'name.lastName required'],
                },
                nickName: {
                    type: String,
                    required: false
                },
                pronouns: {
                    type: String,
                    required: false
                },
            }
        },
        trainingStatus: {
            type: Object,
            required: [false, 'Current training status required.'],
            properties: {
                active: {
                    type: Boolean,
                    required: false,
                    default: true,
                },
                injured: {
                    type: Boolean,
                    required: false,
                },
                resting: {
                    type: Boolean,
                    required: false,
                },
                unknown: {
                    type: Boolean,
                    required: false,
                },
                retired: {
                    type: Boolean,
                    required: false,
                },
            },
        },
        trainingHistory: {
            type: Object,
            required: [false, 'Specify training history. At least "brand new".' ],
            properties: {
                belt: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: [false, 'trainingHistory.belt required.'],
                    ref: 'Belt'
                },
                lastSession: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: [false, 'trainingHistory.lastSession required.'],
                    ref: 'Session'
                },
                firstSession: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: [false, 'trainingHistory.firstSession required.'],
                    ref: 'Session'
                },
                totalTrained: {
                    type: Object,
                    required: [false, 'Specify total trained. Minimum 1 class.'],
                    properties: {
                        sessions: {
                            type: Number,
                            required: [false, 'totalTrained.sessions required.'],
                        },
                        time: {
                            type: Object,
                            required: [false, 'totalTrained.time required.'],
                            properties: {
                                years: {
                                    type: Number,
                                    required: false
                                }
                            }
                        }
                    }
                }
            }
        },
        crm: {
            type: Object,
            required: false,
            properties: {
                id: {
                    type: String,
                    required: [true, 'crm.id required'],
                    unique: true,
                },
            }
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Human', humanSchema)
