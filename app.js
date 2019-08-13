const { NODE_ENV, PORT } = process.env
const express = require('express')
const app = express()
const cors = require('cors')

// Database Connection
require('./db/connection')()

// Application-level Middleware
if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
        const error = new Error('Not allowed by CORS')
        error.status = 401
      callback(error)
    }
  }
}

app.use(cors(corsOptions))
// Attach token to request
app.use(require('./api/middleware/set-token'))

// Routes
app.use('/api', require('./api/routes/auth'))
app.use('/api/users', require('./api/routes/users'))

// Not Found Handler
app.use((req, res, next) => {
  const error = new Error(`Could not ${req.method} ${req.path}`)
  error.status = 404
  next(error)
})

// Error Handler
app.use((err, req, res, next) => {
  if (NODE_ENV === 'development') console.error(err)
  const { message, status } = err
  res.status(status).json({ status, message })
})

// Open Connection
const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)
