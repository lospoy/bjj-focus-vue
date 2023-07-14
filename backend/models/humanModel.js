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
          required: [true, 'Current training status required.'],
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
          current: {
            color: {
              type: Object,
              required: false,
              properties: {
                white: {
                  type: Boolean,
                  required: false
                },
                blue: {
                  type: Boolean,
                  required: false
                },
                purple: {
                  type: Boolean,
                  required: false
                },
                brown: {
                  type: Boolean,
                  required: false
                },
                black: {
                  type: Boolean,
                  required: false
                }
              }
            },
            stripes: {
              type: Object,
              required: false,
              properties: {
                one: {
                  type: Boolean,
                  required: false
                },
                two: {
                  type: Boolean,
                  required: false
                },
                three: {
                  type: Boolean,
                  required: false
                },
                four: {
                  type: Boolean,
                  required: false
                }
              }
            },
            dateAwarded: {
              type: Date,
              required: true
            }
          },
          history: {
            type: Object,
            required: false,
            properties: {}
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
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Human', humanSchema)
