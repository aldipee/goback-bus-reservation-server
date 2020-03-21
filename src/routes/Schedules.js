const router = require('express').Router()

const SchedulesModel = require('../models/Schedules')
const ReservationsModel = require('../models/Reservations')

router.get('/', async (req, res) => {
  // Check if there is sessions
  if (req.query.route || (req.query.origin && req.query.destination)) {
    try {
      const route = {
        idRoute: req.query.route || 0,
        originCode: req.query.origin,
        destinationCode: req.query.destination
      }

      let { page, date, sortBy, sort, limit } = req.query
      page = parseInt(page) || 1
      limit = parseInt(limit) || 5

      // Sort by time, or price, or id
      const key = sortBy
      const value = sort
      sort = (sort && { key, value }) || { key: 'id', value: 1 }

      const conditions = { page, perPage: limit, sort }

      // const results = await SchedulesModel.allSchedule(req.query.route)
      // Create general function for Promise all
      const fetchDataWithSeat = async () => {
        // get all schedules
        const results = await SchedulesModel.allSchedule(route, conditions)
        // if schedules are avaiabale
        if (results.length) {
          // new promise
          const promisess = results.map(async obj => {
            // Get Seat based on idschedule and idroute
            const seatsData = await ReservationsModel.getSeats(obj.id, route)
            // if seatsData avaiable
            if (seatsData) {
              // get all seats number as array then put it on every object from database results
              return { ...obj, seatsInfo: seatsData }
            } else {
              // otherwise, if seat data unavaiable, then just send array of number all seats that avaiable
              return {
                ...obj,
                seatsAvaiable: [...Array.from({ length: obj.total_seat }, (v, k) => k + 1)]
              }
            }
          })
          // wait to all promises complete
          const promiseDone = Promise.all(promisess)
          return promiseDone
        } else {
          // if schedules unavaiable
          res.status(200).send({ status: 'OK', message: 'Bus not found, no schedules for that route' })
        }
        // Wait until all promises resolve retrive the data form seats
      }
      fetchDataWithSeat().then(data => {
        data
          ? res.status(200).send({ status: 'OK', totalData: data.length, data })
          : res.status(201).send({ status: 'OK', message: 'Bus not found' })
      })
    } catch (error) {
      console.log(error)
      res.send({ error })
    }
  } else {
    // if theres no sessions
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
