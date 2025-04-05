const express = require('express')
const router = express.Router()

const {
  login,
  signup,
  changePassword,
} = require('../controller/auth.controller')
const { isAdmin, auth, isStoreOwner } = require('../middleware/authMiddleware')
const { getAllUsers, updateUser } = require('../controller/user.controller')
const { dashboardCount } = require('../controller/dashboard.controller')
const {
  getAllStores,
  createStore,
  updateStore,
  updateStoreRating,
  getStoreRatingsByOwner,
  getAverageRatingByOwner,
} = require('../controller/store.controller')

router.post('/auth/signup', signup)
router.post('/auth/login', login)
router.patch('/auth/change-password', auth, changePassword)

router.get('/users', auth, getAllUsers)
router.post('/user/add', auth, signup)
router.patch('/user/edit/:id', auth, updateUser)

router.get('/dashboard/admin', auth, isAdmin, dashboardCount)
router.get(
  '/dashboard/store_owner',
  auth,
  isStoreOwner,
  getAverageRatingByOwner,
)

router.get('/stores', auth, getAllStores)
router.post('/store/add', auth, createStore)
router.patch('/store/edit/:id', auth, updateStore)
router.patch('/stores/:id/rating', auth, updateStoreRating)
router.get(
  '/store/my-store-ratings',
  auth,
  isStoreOwner,
  getStoreRatingsByOwner,
)

module.exports = router
