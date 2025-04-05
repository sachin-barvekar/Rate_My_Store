const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.signup = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body

    if (!name || !email || !address || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role,
    })

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      userId: user._id,
    })
  } catch (error) {
    console.error('Signup Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Signup failed. Please try again.',
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      })
    }

    let user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please register first.',
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: 'Invalid credentials. Please try again.',
      })
    }

    const payload = { id: user._id, email: user.email, role: user.role }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' })

    user = user.toObject()
    delete user.password

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user,
    })
  } catch (error) {
    console.error('Login Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
    })
  }
}
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id
    const { oldPassword, newPassword, confirmPassword } = req.body

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match.',
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect.',
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    })
  } catch (error) {
    console.error('Change Password Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to change password. Please try again.',
    })
  }
}
