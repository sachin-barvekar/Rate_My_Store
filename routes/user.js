const express = require('express')
const router = express.Router()

const { login, signup } = require('../controller/auth.controller')
const { isAdmin, auth } = require('../middleware/authMiddleware')
const { getAllUsers, updateUser } = require('../controller/user.controller')
const { dashboardCount } = require('../controller/dashboard.controller')
const {
  getAllStores,
  createStore,
  updateStore,
} = require('../controller/store.controller')

router.post('/auth/signup', signup)
router.post('/auth/login', login)

router.get('/users', auth, isAdmin, getAllUsers)
router.post('/user/add', auth, isAdmin, signup)
router.patch('/user/edit/:id', auth, isAdmin, updateUser)

router.get('/dashboard/admin', auth, isAdmin, dashboardCount)

router.get('/stores', auth, isAdmin, getAllStores)
router.post('/store/add', auth, isAdmin, createStore)
router.patch('/store/edit/:id', auth, isAdmin, updateStore)

module.exports = router
