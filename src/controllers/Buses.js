const BusModel = require('../models/Buses')
module.exports = {
  createBus: async (req, res) => {
    if ((req.user && req.user.userRole === 1) || req.user.userRole === 2) {
      if (req.body) {
        try {
          const createdBy = req.user.userId
          const agentId = req.user.agentId || req.body.agentId || null
          const { busName, totalSeat } = req.body
          console.log(req.body)
          console.log(req.file)
          const { filename } = req.file
          const results = await BusModel.insert(busName, totalSeat, agentId, createdBy, filename)
          results
            ? res.status(200).send({ status: true, message: 'New Bus Inserted' })
            : res.status(500).send({ status: false, statusCode: 500 })
        } catch (error) {
          console.log(error)
        }
      } else {
        res.status(400).send({ status: 'INVALIDREQ', message: 'Invalid request , check documentation' })
      }
    } else {
      res.status(401).send({ status: 401, err: 'UNAUTHORIZATION', message: 'Your account is not Agent' })
    }
  },
  updateBus: async (req, res) => {
    if (req.user.userRole === 2) {
      try {
        const { id } = req.params
        const { filename } = req.file
        let { busName, totalSeat } = req.body
        const prevData = await BusModel.busDataById(id)
        busName = busName || prevData.name
        totalSeat = totalSeat || prevData.total_seat
        const result = await BusModel.update(id, busName, totalSeat, req.user.agentId, filename)
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
  },
  getAllBus: async (req, res) => {
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
  },
  getBusById: async (req, res) => {
    if (req.user.userRole === 2 || req.user.userRole === 1) {
      try {
        const results = await BusModel.getBusByAgentId(req.params.id)
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
  },
  getSingleBus: async (req, res) => {
    if (req.user.userRole === 2 || req.user.userRole === 1) {
      try {
        const results = await BusModel.busDataById(req.params.id)

        results
          ? res.status(200).send({ status: 'OK', data: results })
          : res.status(400).send({ status: 'FAILED' })
      } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'ERR', error })
      }
    } else {
      res.status(401).send({ status: 'FORBIDDEN' })
    }
  },
  all: async (req, res) => {
    if (req.user.userRole === 2 || req.user.userRole === 1) {
      try {
        const results = await BusModel.getBusByAgentId(req.params.id)
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
  },
  allBuses: async (req, res) => {
    if (req.user.userRole === 2 || req.user.userRole === 1) {
      try {
        const results = await BusModel.getAllBuses(conditions)
        result.length
          ? res.status(200).send({ status: 'OK', data: results })
          : res.status(200).send({ status: 'OK', data: 'nodata' })
      } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'ERR', error })
      }
    }
  }
}
