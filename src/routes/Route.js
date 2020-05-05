const router = require('express').Router()

const RouteController = require('../controllers/Route')
const authMiddleware = require('../middleware/Auth')
// get All routes
router.get('/', RouteController.allRoutes)
// get a route based on Id
router.get('/:id', authMiddleware.validAuthToken, RouteController.aRoute)
// get All routes
router.get('/', RouteController.allRoutes)
// Create route
router.post('/', authMiddleware.validAuthToken, RouteController.createRoute)
// Update route
router.patch('/:idRoute', authMiddleware.validAuthToken, RouteController.updateRoute)

// delete Route
router.delete('/:idRoute', authMiddleware.validAuthToken, RouteController.deleteRoute)

module.exports = router
