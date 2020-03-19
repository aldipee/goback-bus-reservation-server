const router = require('express').Router()

const RouteModel = require('../models/Route')

// get All routes
router.get('/', async (req, res) => {
  if (req.user && req.user.userRole === 1) {
    const result = await RouteModel.getAll()
    result
      ? res.status(200).send({ status: 'Ok', data: result })
      : res.status(500).send({ status: 'FAILED', statusCode: 500 })
  } else {
    res.status(401).send({ status: 401, message: 'UNAUTHORIZATION' })
  }
})
// Create route
router.post('/', async (req, res) => {
  if (req.user && req.user.userRole === 1) {
    if (req.body) {
      const { destination, origin, distance } = req.body
      const result = await RouteModel.insert(destination, origin, distance, req.user.userId)
      result
        ? res.status(200).send({ status: 'OK', message: 'Routes inserted' })
        : res.status(500).send({ status: 'FAILED', statusCode: 500 })
    } else {
      res.status(400).send({ status: 'FAILED', message: 'INVALID REQUEST' })
    }
  } else {
    res.status(401).send({ status: 401, message: 'UNAUTHORIZATION' })
  }
})

module.exports = router
