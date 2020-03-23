const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const cors = require('cors')

// Route
const indexRouter = require('./src/routes/Home')
const usersRouter = require('./src/routes/Users')
const authRouter = require('./src/routes/Auth')
const agentsRouter = require('./src/routes/Agents')
const routesRouter = require('./src/routes/Route')
const busesRouter = require('./src/routes/Buses')
const schedulesRouter = require('./src/routes/Schedules')
const reservationRouter = require('./src/routes/Reservations')

// Midleware
const authMiddleware = require('./src/middleware/Auth')
const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(process.env.PUBLIC_URL, express.static(path.join(__dirname, process.env.PUBLIC_PATH)))

// Routes
app.use('/', indexRouter)
app.use('/users', authMiddleware.validAuthToken, usersRouter)
app.use('/auth', authRouter)
app.use('/agents', authMiddleware.validAuthToken, agentsRouter)
app.use('/routes', authMiddleware.validAuthToken, routesRouter)
app.use('/bus', authMiddleware.validAuthToken, busesRouter)
app.use('/schedules', schedulesRouter)
app.use('/reservations', authMiddleware.validAuthToken, reservationRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  if (err.code === 'FORMATTYPE') {
    res.status(400).send({ err: err.message })
  }
  res.status(err.status || 500)
  res.send(err.status)
})

module.exports = app
