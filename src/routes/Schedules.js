const router = require('express').Router()
const authMiddleware = require('../middleware/Auth')
const ScheduleController = require('../controllers/Schedules')

// All Schedules [public]
router.get('/', ScheduleController.allSchedules)
// Schedules related to agent
router.get('/my-schedules', authMiddleware.validAuthToken, ScheduleController.agentSchedules)
// Get Schedules by Id
router.get('/:id', authMiddleware.validAuthToken, ScheduleController.getSchedulesById)
// New Schedules
router.post('/', authMiddleware.validAuthToken, ScheduleController.addSchedules)
// Update shedules
router.patch('/:idSchedule', authMiddleware.validAuthToken, ScheduleController.updateSchedule)
router.post('/price', authMiddleware.validAuthToken, ScheduleController.addPrice)
router.patch('/price/:id', authMiddleware.validAuthToken, ScheduleController.updatePrice)
router.get('/price', authMiddleware.validAuthToken, ScheduleController.getPrice)

module.exports = router
