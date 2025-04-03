const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 60 },
  email: { type: String, required: true, unique: true },
  address: { type: String, maxlength: 400 },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'normal', 'store_owner'],
    default: 'normal',
  },
})

module.exports = mongoose.model('user', userSchema)
