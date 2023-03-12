const mongoose = require('mongoose')
// here we define the SCHEMA for the BJJ classes or "sessions" (to avoid using typical programming words)
// sessions are unlimited, it's every instance that a teacher holds a BJJ class

const sessionSchema = mongoose.Schema(
    {
        // date/time the session was held
        when: {
            type: Object,
            required: [true, 'Date "when" required.'],
            properties: {
                // day held
                date: {
                    type: Date,
                    required: [true, 'Date required.'],
                },
            }
        },
        who: {
            type: Object,
            required: [true, 'Attendance "who" required.'],
            properties: {
                teacher: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: [true, 'Teacher required.'],
                    ref: 'Human'
                },
                students: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Human',
                    required: [true, 'Students required.'],
                },
            }
        },
        // type of session: focus, allLevels, advanced, etc.
        // array of techniques
        // gi or nogi
        what: {
            type: Object,
            required: [false, 'Type of session "what" required.'],
            properties: {
                focus: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: false,
                    ref: 'FocusLesson',
                },
                // seminar: {

                // },
                // workshop: {

                // }
            }
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Session', sessionSchema)