const router = require('express').Router()

const SchedulesModel = require('../models/Schedules')
const ReservationsModel = require('../models/Reservations')

router.get('/', async (req, res) => {
  if (req.user) {
    try {
      console.log(req.query.route)
      // const results = await SchedulesModel.allSchedule(req.query.route)

      // Create general function for Promise all
      const fetchDataWithSeat = async () => {
        const results = await SchedulesModel.allSchedule(req.query.route)
        const promisess = results.map(async obj => {
          // Get Seat
          const seatsData = await ReservationsModel.getSeats(obj.id, req.query.route)
          return { ...obj, seatsInfo: seatsData }
        })

        // Wait until all promises resolve retrive the data form seats
        const promiseDone = Promise.all(promisess)
        return promiseDone
      }
      fetchDataWithSeat().then(data => {
        data
          ? res.status(200).send({ status: 'OK', data })
          : res.status(201).send({ status: 'OK', message: 'Bus not found' })
      })
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
