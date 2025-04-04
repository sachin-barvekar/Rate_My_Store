const User = require('../models/User')
const Store = require('../models/Store')

exports.dashboardCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalStore = await Store.countDocuments()

    return res.status(200).json({
      success: true,
      totalUsers,
      totalStore,
    })
  } catch (error) {
    console.error('Error fetching user count:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user count. Please try again.',
    })
  }
}
