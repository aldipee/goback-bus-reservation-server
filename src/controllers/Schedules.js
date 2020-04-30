const SchedulesModel = require('../models/Schedules')
const ReservationsModel = require('../models/Reservations')

module.exports = {
  getPrice: async (req, res) => {
    if (req.user.userRole === 2) {
      try {
        const result = await SchedulesModel.getPriceForAgent(req.user.agentId)
        result
          ? res.status(200).send({ status: 'OK', data: result })
          : res.status(400).send({ status: 'FAILED', message: 'BAD REQUEST' })
      } catch (error) {
        console.log(error)
        res.status(500).send({ status: 'ERRR', error })
      }
    } else {
      res.status(401).send({ status: 'FORIBIDDEN' })
    }
  },
  updatePrice: async (req, res) => {
    if (req.user.userRole === 2) {
      try {
        const { id } = req.params
        const { price } = req.body
        const result = await SchedulesModel.updatePriceById(id, price)
        console.log(result)
        result
          ? res.status(200).send({ status: 'OK', message: 'Price Updated' })
          : res.status(400).send({ status: 'FAILED', message: 'BAD REQUEST' })
      } catch (error) {
        res.status(500).send({ status: 'ERRR', error })
      }
    } else {
      res.status(401).send({ status: 'FORIBIDDEN' })
    }
  },
  addPrice: async (req, res) => {
    console.log(req.user)
    if (req.user.userRole === 2) {
      try {
        const { routeId, price } = req.body
        const { agentId } = req.user
        const isPriceAlreadySet = await SchedulesModel.isPriceAlreadySet(routeId, agentId)
        if (!isPriceAlreadySet) {
          const result = await SchedulesModel.setPrice(routeId, price, agentId)
          result
            ? res.status(200).send({ status: 'OK', message: 'Price Added' })
            : res.status(400).send({ status: 'FAILED', message: 'BAD REQUEST' })
        } else {
          res.status(400).send({ status: 'FAILED', message: 'PRICE ALREADY SET' })
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      res.status(401).send({ status: 'FORIBIDDEN' })
    }
  },
  updateSchedule: async (req, res) => {
    if (req.user.userRole === 2) {
      try {
        const { idSchedule } = req.params
        const prevData = await SchedulesModel.getSchedulesById(idSchedule)
        const data = {
          time: req.body.time || prevData.time,
          date: req.body.date || prevData.date,
          idRoute: req.body.route_id || prevData.route_id,
          idBus: req.body.bus_id || prevData.bus_id
        }

        const result = await SchedulesModel.update(idSchedule, req.user.agentId, data)
        result
          ? res.status(200).send({ status: 'OK', message: 'Schedules updated' })
          : res.status(404).send({ status: 'FAILED', message: 'Schedules NOT FOUND' })
      } catch (error) {
        console.log(error, 'THIS ERRO COMES FROM SCHEDULES ROUTER')
      }
    } else {
      res.status(401).send({ status: 'FORBIDDEN' })
    }
  },
  addSchedules: async (req, res) => {
    if ((req.user && req.user.userRole === 2) || req.user.userRole === 1) {
      // console.log(`USER SESSIONS : ${req.user}`)
      // console.log(`USER BODY : ${req.body}`)
      try {
        const { userId, agentId } = req.user
        let { time, routeId, busId, date } = req.body
        date = date || new Date().toISOString().slice(0, 10)
        const results = await SchedulesModel.create(time, routeId, busId, agentId, userId, date)
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
  },
  allSchedules: async (req, res) => {
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
        const key = sortBy || 'id'
        const value = sort
        sort = (sort && { key, value }) || { key: 'id', value: 1 }

        const todayDate = new Date().toISOString().slice(0, 10)
        date = date || todayDate
        const conditions = { page, limit, sort, date }
        const totalResults = await SchedulesModel.totalSchedule(route, conditions.date)
        // const results = await SchedulesModel.allSchedule(req.query.route)
        // Create general function for Promise all
        const fetchDataWithSeat = async () => {
          // get all schedules
          const results = await SchedulesModel.allSchedule(route, conditions)

          // if schedules are avaiabale
          if (results.length) {
            // new promise
            const promisess = results.map(async (obj) => {
              // Get Seat based on idschedule and idroute
              const seatsData = await ReservationsModel.getSeats(obj.id, route)
              // if seatsData avaiable
              if (seatsData) {
                // get all seats number as array then put it on every object from database results
                //
                // obj.date = obj.date.toLocaleDateString()
                return { ...obj, seatsAvaiable: seatsData.seatsAvailable, seatsBooked: seatsData.seatsBooked }
              } else {
                // otherwise, if seat data unavaiable, then just send array of number all seats that avaiable
                // obj.date = obj.date.toLocaleDateString()
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
        fetchDataWithSeat().then((data) => {
          data
            ? res.status(200).send({
                status: 'OK',
                limit,
                totalData: totalResults,
                page,
                totalPage: Math.ceil(totalResults / limit),
                data
              })
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
  },
  agentSchedules: async (req, res) => {
    // Check if there is sessions
    console.log(req.user)
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
        const key = sortBy || 'id'
        const value = sort
        sort = (sort && { key, value }) || { key: 'id', value: 1 }
        console.log(sort, 'SORTTTTTTTTTTT')
        const todayDate = new Date().toISOString().slice(0, 10)
        date = date || todayDate
        const conditions = { page, limit, sort, date }
        const totalResults = await SchedulesModel.totalSchedule(route, conditions.date)
        // const results = await SchedulesModel.allSchedule(req.query.route)
        // Create general function for Promise all
        const fetchDataWithSeat = async () => {
          // get all schedules
          const results = await SchedulesModel.mySchedules(route, conditions, req.user.agentId)

          // if schedules are avaiabale
          if (results.length) {
            // new promise
            const promisess = results.map(async (obj) => {
              // Get Seat based on idschedule and idroute
              const seatsData = await ReservationsModel.getSeats(obj.id, route)
              // if seatsData avaiable
              if (seatsData) {
                // get all seats number as array then put it on every object from database results
                //
                obj.date = obj.date.toLocaleDateString()
                return { ...obj, seatsAvaiable: seatsData }
              } else {
                // otherwise, if seat data unavaiable, then just send array of number all seats that avaiable
                obj.date = obj.date.toLocaleDateString()
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
        fetchDataWithSeat().then((data) => {
          data
            ? res.status(200).send({
                status: 'OK',
                totalData: totalResults,
                page,
                totalPage: Math.ceil(totalResults / limit),
                data
              })
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
  },
  getSchedulesById: async (req, res) => {
    if (req.user) {
      try {
        const result = await SchedulesModel.getSchedulesById(req.params.id)
        res ? res.send({ status: 'OK', data: result }) : res.send({ data: 'DATA NOT FOUND' })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
