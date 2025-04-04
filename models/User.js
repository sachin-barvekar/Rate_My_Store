const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 20, maxlength: 60 },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  address: { type: String, maxlength: 400 },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'store_owner'],
    default: 'user',
  },
})

module.exports = mongoose.model('user', userSchema)
