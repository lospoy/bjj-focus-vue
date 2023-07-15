// here we define the user SCHEMA
const mongoose = require('mongoose')

const humanSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User'
    },
    name: {
      type: Object,
      required: [true, 'Name required'],
      properties: {
        first: {
          type: String,
          required: [true, 'name.firstName required']
        },
        last: {
          type: String,
          required: [true, 'name.lastName required']
        },
        nickName: {
          type: String,
          required: false
        },
        pronouns: {
          type: String,
          required: false
        }
      }
    },
    trainingData: {
      type: Object,
      required: true,
      properties: {
        status: {
          type: Object,
          required: true,
          properties: {
            active: {
              type: Boolean,
              required: false,
              default: true
            },
            injured: {
              type: Boolean,
              required: false
            },
            retired: {
              type: Boolean,
              required: false
            }
          }
        },
        belt: {
          type: Object,
          required: false,
          properties: {
            history: {
              type: Object,
              required: false,
              properties: {
                // dateAwarded: Date
                // color: {purple: true}
                // stripes: {one: true}
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
            unique: true
          }
        }
      }
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Human', humanSchema)
