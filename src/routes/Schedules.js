const router = require('express').Router()

const SchedulesModel = require('../models/Schedules')
const ReservationsModel = require('../models/Reservations')

router.get('/', async (req, res) => {
  if (req.user) {
    try {
      console.log(req.query.route)
      const results = await SchedulesModel.allSchedule(req.query.route)
      let s
      let data = results.map(async obj => {
        const d = await ReservationsModel.getSeats(obj.id, req.query.route)
        const dsad = { ...obj, d }
        s += dsad
        const res = Promise.all(d)
        return res
      })

      data
        ? res.status(200).send({ status: 'OK', data })
        : res.status(201).send({ status: 'OK', message: 'Bus not found' })
    } catch (error) {
      console.log(error)
      res.send({ error })
    }
  } else {
    res.status(400).send({ status: 'UNAUTHORIZATION', statusCode: 400 })
  }
})
router.post('/', async (req, res) => {
  console.log(req.user)
  if ((req.user && req.user.userRole === 2) || req.user.userRole === 1) {
    // console.log(`USER SESSIONS : ${req.user}`)
    // console.log(`USER BODY : ${req.body}`)
    try {
      const { userId, agentId } = req.user
      const { time, routeId, busId } = req.body
      const results = await SchedulesModel.create(time, routeId, busId, agentId, userId)
      results
        ? res.status(200).send({ status: 'OK', message: 'New Schedule Inserted' })
        : res.status(500).send({ status: 'ERR', statusCode: 500 })
    } catch (error) {
      console.log(error)
      res.send({ error })
    }
  } else {
    res.status(400).send({ status: 'UNAUTHORIZATION', statusCode: 400 })
  }
})

module.exports = router
