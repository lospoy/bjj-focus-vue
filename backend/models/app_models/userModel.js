// here we define the user SCHEMA
const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        role: {
            type: Object,
            required: false,
            properties: {
                admin: {
                    type: Boolean,
                    required: false
                },
                teacher: {
                    type: Boolean,
                    required: false
                },
                student: {
                    type: Boolean,
                    required: false
                },
            }
        },
        human: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Human',
        },
        appMetrics: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'AppMetric',
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)
