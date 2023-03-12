const mongoose = require('mongoose')

const variationSchema = mongoose.Schema(
    {
        name: {
            type: Object,
            required: [true, 'Name required'],
            properties: {
                english: {
                    type: String,
                    required: false,
                },
                portuguese: {
                    type: String,
                    required: false,
                },
                japanese: {
                    type: Object,
                    required: false,
                    properties: {
                        kanji: {
                            type: String,
                            required: false,
                        },
                        hiraganaReading: {
                            type: String,
                            required: false,
                        },
                        romajiReading: {
                            type: String,
                            required: false,
                        },
                    }
                },

            },

        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Variation', variationSchema)
