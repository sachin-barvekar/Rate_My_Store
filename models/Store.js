const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    address: { type: String, maxlength: 400 },
    storeOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    rating: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        value: { type: Number, min: 1, max: 5 },
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('store', storeSchema)
