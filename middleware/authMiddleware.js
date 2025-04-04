const jwt = require('jsonwebtoken')
require('dotenv').config()

const sendResponse = (res, statusCode, success, message) => {
  return res.status(statusCode).json({ success, message })
}

exports.auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return sendResponse(
        res,
        401,
        false,
        'Token missing. Authentication required.',
      )
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      return sendResponse(res, 401, false, 'Invalid token.')
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error)
    return sendResponse(res, 500, false, 'Authentication failed.')
  }
}

exports.isStoreOwner = (req, res, next) => {
  if (req.user.role !== 'store_owner') {
    return sendResponse(res, 403, false, 'Access denied. Store owners only.')
  }
  next()
}

exports.isNormalUser = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return sendResponse(res, 403, false, 'Access denied. Normal users only.')
  }
  next()
}

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return sendResponse(res, 403, false, 'Access denied. Admins only.')
  }
  next()
}
