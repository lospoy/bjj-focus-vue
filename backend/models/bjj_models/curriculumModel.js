const mongoose = require('mongoose')

const curriculumSchema = mongoose.Schema(
    {
        focus: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'FocusLesson',
        },
        bjj: {
            type: Object,
            required: false,
            properties: {
                techniques: {
                    type: Boolean,
                    required: false,
                },
                advanced: {
                    type: Boolean,
                    required: false,
                },
                lab: {
                    type: Boolean,
                    required: false,
                },
            },
        },
        nogi: {
            type: Object,
            required: false,
            properties: {
                techniques: {
                    type: Boolean,
                    required: false,
                },
                advanced: {
                    type: Boolean,
                    required: false,
                },
            }
        },
        openMat: {
            type: Boolean,
            required: false,
        },
        // array of techniques/moves that were taught in the session
        techniques: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Technique',
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Curriculum', curriculumSchema)
