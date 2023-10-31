const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info(`Connecting to ${config.MONGODB_URL}`)

mongoose.connect(config.MONGODB_URL)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app
