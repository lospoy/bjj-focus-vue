const mongoose = require('mongoose')

const beltSchema = mongoose.Schema(
    {
        color: {
            type: String,
            required: [true, 'Name required'],
        },
        stripes: {
            type: Object,
            required: false,
            properties: {
                oneStripe: {
                    type: Boolean,
                    required: false,
                },
                twoStripe: {
                    type: Boolean,
                    required: false,
                },
                threeStripe: {
                    type: Boolean,
                    required: false,
                },
                fourStripe: {
                    type: Boolean,
                    required: false,
                },
            }
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Belt', beltSchema)
