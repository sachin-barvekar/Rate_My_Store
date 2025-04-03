const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const dbConnect = require('./config/database.js')
const userRoutes = require('./routes/user.js')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

dbConnect()

// CORS Configuration
app.use(
  cors({
    origin: '*',
  }),
)

// Middleware
app.use(cookieParser())
app.use(express.json())

// API Routes
app.use('/api/v1', userRoutes)

// Test Route
app.get('/', (req, res) => {
  res.send("<h1>Backend is Running and this is '/' Route</h1>")
})

// Start Server
app.listen(PORT, () => {
  console.log(`THE SERVER IS UP AND RUNNING AT PORT ${PORT}`)
})
