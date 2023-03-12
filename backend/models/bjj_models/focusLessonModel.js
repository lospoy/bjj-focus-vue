const mongoose = require('mongoose')

const focusLessonSchema = mongoose.Schema(
    {
        topic: {
            type: String,
            required: [true, 'Topic required.'],
        },
        content: {
            type: Object,
            required: [true, 'Contents of the lesson required.'],
            properties: {
                techniques: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: [true, 'Techniques required.'],
                    ref: 'Technique',
                },
            }
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('FocusLesson', focusLessonSchema)
