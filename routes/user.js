const express = require('express')
const router = express.Router()

const { login, signup } = require('../controller/auth.controller')

router.post('/auth/signup', signup)
router.post('/auth/login', login)

module.exports = router
