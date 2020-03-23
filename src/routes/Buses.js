const router = require('express').Router()

const BusController = require('../controllers/Buses')

/**
 * Create Bus,  and admin only
 */
router.post('/', BusController.createBus)
router.patch('/:id', BusController.updateBus)
router.get('/', BusController.getAllBus)

module.exports = router
