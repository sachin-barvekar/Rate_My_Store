const User = require('../models/User')
const Store = require('../models/Store')

exports.dashboardCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalStore = await Store.countDocuments()

    const totalSubmittedRatings = await Store.aggregate([
      { $unwind: '$rating' },
      { $count: 'totalSubmittedRatings' },
    ])

    return res.status(200).json({
      success: true,
      totalUsers,
      totalStore,
      totalSubmittedRatings:
        totalSubmittedRatings.length > 0
          ? totalSubmittedRatings[0].totalSubmittedRatings
          : 0,
    })
  } catch (error) {
    console.error('Error fetching dashboard count:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard count. Please try again.',
    })
  }
}
