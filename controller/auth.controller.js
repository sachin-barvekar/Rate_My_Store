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

    const cookieOptions = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }

    res.cookie('auth_token', token, cookieOptions)
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

exports.logout = async (req, res) => {
  try {
    res.clearCookie('auth_token')
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    })
  } catch (error) {
    console.error('Logout Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Logout failed. Please try again.',
    })
  }
}
