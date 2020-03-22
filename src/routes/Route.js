const router = require('express').Router()

const RouteModel = require('../models/Route')

// get All routes
router.get('/', async (req, res) => {
  if ((req.user && req.user.userRole === 1) || req.user.userRole === 2) {
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

// Update route
router.patch('/:idRoute', async (req, res) => {
  if (req.user.userRole === 1) {
    try {
      const { idRoute } = req.params
      const prevData = await RouteModel.getRouteById(idRoute)
      const data = {
        destination: req.body.destination || prevData.destination,
        destinationCode: req.body.destinationCode || prevData.destination_code,
        origin: req.body.origin || prevData.origin,
        originCode: req.body.originCode || prevData.origin_code,
        distance: req.body.distance || prevData.distance
      }
      const result = await RouteModel.updateRouteById(idRoute, data)
      result
        ? res.status(200).send({ status: 'OK', message: 'Route updated' })
        : res.status(404).send({ status: 'FAILED', message: 'ROUTE NOT FOUND' })
    } catch (error) {
      console.log(error, 'THIS ERRO COMES FROM ROUTE ROUTER')
    }
  } else {
    res.status(401).send({ status: 'FORBIDDEN' })
  }
})

// delete Route
router.delete('/:idRoute', async (req, res) => {
  if (req.user.userRole === 1) {
    const res = await RouteModel.deleteRouteById(req.params.idRoute)
    res
      ? res.status(200).send({ status: 'OK', message: 'Route deleted' })
      : res.status(404).send({ status: 'FAILED', message: 'ROUTE NOT FOUND' })
  } else {
    res.status(401).send({ status: 'FORBIDDEN' })
  }
})

module.exports = router
