const router = require('express').Router()

const BusModel = require('../models/Buses')

/**
 * Create Bus,  and admin only
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
      res.status(400).send({ status: 'INVALIDREQ', message: 'Invalid request , check documentation' })
    }
  } else {
    res.status(401).send({ status: 401, err: 'UNAUTHORIZATION', message: 'Your account is not Agent' })
  }
})
router.patch('/:id', async (req, res) => {
  if (req.user.userRole === 2) {
    try {
      const { id } = req.params
      let { busName, totalSeat } = req.body
      const prevData = await BusModel.busDataById(id)
      busName = busName || prevData.name
      totalSeat = totalSeat || prevData.total_seat
      const result = await BusModel.update(id, busName, totalSeat, req.user.agentId)
      result
        ? res.status(200).send({ status: 'OK', message: 'Bus Updated' })
        : res.status(400).send({ status: 'FAILED', message: 'BAD REQUEST' })
    } catch (error) {
      console.log(error)
      res.status(500).send({ status: 'ERR', error })
    }
  } else {
    res.status(401).send({ status: 'FORBIDDEN' })
  }
})

router.get('/', async (req, res) => {
  if (req.user.userRole === 2) {
    try {
      const results = await BusModel.getBusByAgentId(req.user.agentId)
      results.length
        ? res.status(200).send({ status: 'OK', data: results })
        : res.status(400).send({ status: 'FAILED' })
    } catch (error) {
      console.log(error)
      res.status(500).send({ status: 'ERR', error })
    }
  } else {
    res.status(401).send({ status: 'FORBIDDEN' })
  }
})

module.exports = router
