const User = require('../models/User')

exports.getAllUsers = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '', role } = req.query

    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    const userQuery = {}

    if (role) {
      userQuery.role = role
    }

    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ]
    }

    const users = await User.find(userQuery)
      .select('name email role address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalElements = await User.countDocuments(userQuery)
    const totalPages = Math.ceil(totalElements / size)

    res.status(200).json({
      content: users,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: false,
        empty: users.length === 0,
        unsorted: true,
      },
      numberOfElements: users.length,
      first: page === 0,
      empty: users.length === 0,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, address, role } = req.body

    if (!name || !email || !address || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      })
    }

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }
    if (email !== user.email) {
      const emailExists = await User.findOne({ email })
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use.',
        })
      }
    }
    user.name = name
    user.email = email
    user.address = address
    user.role = role

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      userId: user._id,
    })
  } catch (error) {
    console.error('Update Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update user.',
    })
  }
}
