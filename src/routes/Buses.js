const router = require('express').Router()

const BusController = require('../controllers/Buses')
const BusModel = require('../models/Buses')

/**
 * Create Bus,  and admin only
 */
router.post('/', BusController.createBus)
router.patch('/:id', BusController.updateBus)
router.get('/', BusController.getAllBus)
router.get('/:id', BusController.getBusById)

module.exports = router
