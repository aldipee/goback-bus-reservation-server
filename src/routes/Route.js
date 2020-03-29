const router = require('express').Router()

const RouteController = require('../controllers/Route')

// get All routes
router.get('/', RouteController.allRoutes)
// get a route based on Id
router.get('/:id', RouteController.aRoute)
// get All routes
router.get('/', RouteController.allRoutes)
// Create route
router.post('/', RouteController.createRoute)
// Update route
router.patch('/:idRoute', RouteController.updateRoute)
// delete Route
router.delete('/:idRoute', RouteController.deleteRoute)

module.exports = router
