const router = require('express').Router()

const BusModel = require('../models/Buses')

/**
 * Create Bus, only for superadmin and admin only
 */
router.post('/', async (req, res) => {
  if ((req.user && req.user.userRole === 1) || req.user.userRole === 2) {
    if (req.body) {
      try {
        const createdBy = req.user.userId
        const agentId = req.user.agentId || req.body.agentId || null
        const { busName, totalSeat } = req.body
        const results = await BusModel.insert(busName, totalSeat, agentId, createdBy)
        results
          ? res.status(200).send({ status: 'OK', message: 'New Bus Inserted' })
          : res.status(500).send({ status: 'ERR', statusCode: 500 })
      } catch (error) {
        console.log(error)
      }
    } else {
      res
        .status(400)
        .send({ status: 'INVALIDREQ', message: 'Invalid request , check documentation' })
    }
  } else {
    res
      .status(401)
      .send({ status: 401, err: 'UNAUTHORIZATION', message: 'Your account is not Agent' })
  }
})

module.exports = router
