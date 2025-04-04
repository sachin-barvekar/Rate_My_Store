const express = require('express')
const router = express.Router()

const { login, signup } = require('../controller/auth.controller')
const { isAdmin, auth } = require('../middleware/authMiddleware')
const { getAllUsers, updateUser } = require('../controller/user.controller')

router.post('/auth/signup', signup)
router.post('/auth/login', login)

router.get('/users', auth, isAdmin, getAllUsers)
router.post('/user/add', auth, isAdmin, signup)
router.patch('/user/edit/:id', auth, isAdmin, updateUser)

module.exports = router
