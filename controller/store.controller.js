const Store = require('../models/Store')
const User = require('../models/User')

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, storeOwner } = req.body

    if (!name || !email || !address || !storeOwner) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      })
    }

    const existingStore = await Store.findOne({ email })
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'Store with this email already exists.',
      })
    }

    const owner = await User.findById(storeOwner)
    if (!owner || owner.role !== 'store_owner') {
      return res.status(400).json({
        success: false,
        message:
          'Invalid store owner. Only users with role "store_owner" can create a store.',
      })
    }
    const existingStoreForOwner = await Store.findOne({ storeOwner })
    if (existingStoreForOwner) {
      return res.status(400).json({
        success: false,
        message: 'This user has already created a store.',
      })
    }

    const newStore = await Store.create({
      name,
      email,
      address,
      storeOwner,
    })

    return res.status(201).json({
      success: true,
      message: 'Store created successfully.',
      store: newStore,
    })
  } catch (error) {
    console.error('Create Store Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create store. Please try again later.',
    })
  }
}

exports.getAllStores = async (req, res) => {
  try {
    let { page = 0, size = 10, search = '' } = req.query

    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    const storeQuery = {}

    if (search) {
      storeQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ]
    }

    const stores = await Store.find(storeQuery)
      .populate('storeOwner', 'name')
      .select('name email address storeOwner rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const formattedStores = stores.map(store => ({
      ...store.toObject(),
      storeOwner: store.storeOwner?.name || '-',
      storeOwnerId: store.storeOwner?._id || '-',
    }))

    const totalElements = await Store.countDocuments(storeQuery)
    const totalPages = Math.ceil(totalElements / size)

    res.status(200).json({
      content: formattedStores,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: false,
        empty: formattedStores.length === 0,
        unsorted: true,
      },
      numberOfElements: formattedStores.length,
      first: page === 0,
      empty: formattedStores.length === 0,
    })
  } catch (error) {
    console.error('Error fetching stores:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params
    const storeId = id
    const { name, email, address, storeOwner } = req.body

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required.',
      })
    }

    const store = await Store.findById(storeId)
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
      })
    }

    if (storeOwner) {
      const owner = await User.findById(storeOwner)
      if (!owner || owner.role !== 'store_owner') {
        return res.status(400).json({
          success: false,
          message:
            'Invalid store owner. Only users with role "store_owner" can be assigned.',
        })
      }
    }
    store.name = name || store.name
    store.email = email || store.email
    store.address = address || store.address
    store.storeOwner = storeOwner || store.storeOwner

    await store.save()

    return res.status(200).json({
      success: true,
      message: 'Store updated successfully.',
      store,
    })
  } catch (error) {
    console.error('Update Store Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update store. Please try again later.',
    })
  }
}

exports.updateStoreRating = async (req, res) => {
  try {
    const { id } = req.params
    const storeId = id
    const rating = req.body.rating

    const userId = Object.keys(rating)[0]
    const value = rating[userId]

    if (!userId || !value) {
      return res
        .status(400)
        .json({ message: 'User ID and rating value are required' })
    }

    if (value < 1 || value > 5) {
      return res
        .status(400)
        .json({ message: 'Rating value must be between 1 and 5' })
    }
    const store = await Store.findById(storeId)
    if (!store) {
      return res.status(404).json({ message: 'Store not found' })
    }

    const existingRating = store.rating.find(
      r => r.userId.toString() === userId,
    )

    if (existingRating) {
      existingRating.value = value
    } else {
      store.rating.push({ userId, value })
    }

    await store.save()

    return res
      .status(200)
      .json({ success: true, message: 'Rating updated successfully', store })
  } catch (error) {
    console.error('Error updating store rating:', error)
    res.status(500).json({ success: true, message: 'Internal server error' })
  }
}

exports.getStoreRatingsByOwner = async (req, res) => {
  try {
    const storeOwnerId = req.user.id
    let { page = 0, size = 10 } = req.query
    page = parseInt(page)
    size = parseInt(size)

    const limit = size === 0 ? 0 : size
    const skip = page * size

    const store = await Store.findOne({ storeOwner: storeOwnerId }).populate(
      'rating.userId',
      'name email address role',
    )

    if (!store) {
      return res.status(404).json({ message: 'No store found for this owner' })
    }

    const totalElements = store.rating.length
    const totalPages = size === 0 ? 1 : Math.ceil(totalElements / size)

    const paginatedRatings = store.rating.slice(skip, skip + limit).map(r => ({
      userId: r.userId._id,
      username: r.userId.name,
      useremail: r.userId.email,
      useraddress: r.userId.address,
      userrole: r.userId.role,
      userratingValue: r.value,
    }))

    res.status(200).json({
      content: paginatedRatings,
      storeName: store.name,
      storeId: store._id,
      totalElements,
      totalPages,
      last: page + 1 === totalPages,
      size,
      number: page,
      sort: {
        sorted: false,
        empty: paginatedRatings.length === 0,
        unsorted: true,
      },
      numberOfElements: paginatedRatings.length,
      first: page === 0,
      empty: paginatedRatings.length === 0,
    })
  } catch (err) {
    console.error('Error fetching store ratings:', err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

exports.getAverageRatingByOwner = async (req, res) => {
  try {
    const storeOwnerId = req.user.id

    const store = await Store.findOne({ storeOwner: storeOwnerId })

    if (!store) {
      return res.status(404).json({ message: 'No store found for this owner' })
    }

    const totalRatings = store.rating.length

    if (totalRatings === 0) {
      return res.status(200).json({
        storeName: store.name,
        storeId: store._id,
        totalRatings: 0,
        averageRating: 0,
      })
    }

    const ratingSum = store.rating.reduce((acc, r) => acc + r.value, 0)
    const averageRating = parseFloat((ratingSum / totalRatings).toFixed(2))

    res.status(200).json({
      storeName: store.name,
      storeId: store._id,
      totalRatings,
      averageRating,
    })
  } catch (err) {
    console.error('Error calculating average rating:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
