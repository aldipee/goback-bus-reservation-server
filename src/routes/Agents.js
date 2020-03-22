const router = require('express').Router()

const AgentsModel = require('../models/Agents')

// Get All agents
router.get('/', async (req, res) => {
  if (req.user && req.user.userRole === 1) {
    const results = await AgentsModel.getAll()
    results
      ? res.status(200).send({ status: 'OK', totalData: results.length, data: results })
      : res.status(400).send({ status: 'NOTFOUND', message: 'Data not found' })
  }
})
router.post('/check-in', async (req, res) => {
  console.log(req.user)
  if (req.user.userRole === 2) {
    try {
      const { bookingCode } = req.body
      const isCheckInDone = await AgentsModel.passengerCheckIn(bookingCode)
      if (isCheckInDone) {
        const detailsInfo = await AgentsModel.reservationsDetailsByBookingCode(bookingCode)
        console.log(isCheckInDone)
        detailsInfo
          ? res.status(200).send({ status: 'Check-In Completed', detailsInfo })
          : res.status(400).send({ status: 'CHECK IN FAILED', message: `${bookingCode} not found` })
      } else {
        res.status(400).send({ status: 'CHECK IN FAILED', message: `${bookingCode} not found` })
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    res.status(400).send({ status: 'UNAUTHORIZATION', message: `GO ON, NOW!!` })
  }
})
// Create Agents
router.post('/', async (req, res) => {
  if (req.user.userRole === 1) {
    if (req.body) {
      const { agentName, userId } = req.body
      try {
        const results = await AgentsModel.insert(agentName, userId, req.user.userId)
        results ? res.send({ status: 'OK', message: 'Sucess convert user to become agent' }) : res.status(500).send({ err: 'Failed' })
      } catch (error) {
        console.log(error)
        res.status(500).send({ status: 500, error })
      }
    } else {
      res.status(400).send({ status: 400, message: 'Invalid request' })
    }
  } else {
    res.status(403).send({ status: 403, message: 'UNAUTHORIZATION' })
  }
})

module.exports = router
