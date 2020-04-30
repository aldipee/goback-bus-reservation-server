const uuid = require('uuid').v4
const ReservationModel = require('../models/Reservations')
const UserModel = require('../models/User')

module.exports = {
  allReservations: async (req, res) => {
    if (req.user.userRole === 1) {
      try {
        // Star pagination
        let { search, sort, page, limit } = req.query
        search = search || { key: 'fullName', value: '' }
        sort = sort || { key: 'fullName', value: 0 }
        page = page || 1
        perPage = limit || 5

        const conditions = { search, sort, page, perPage }
        const result = await ReservationModel.getAllReservations(conditions)
        const totalData = await ReservationModel.getTotalReservations()
        conditions.totalData = totalData
        delete conditions.sort
        delete conditions.search
        console.log(`from routes`, conditions)
        result
          ? res.status(200).send({ status: 'OK', pageInfo: conditions, data: result })
          : res.status(400).send({ status: 401, err: 'BAD REQUEST' })
      } catch (error) {
        res.status(400).send({ success: false, status: 401, err: 'BAD REQUEST', error_code: '1101' })
      }
    } else {
      res.status(401).send({
        status: 401,
        err: 'FORBIDDEN',
        message: 'UNAUTHORIZATIOON',
        error_code: '1007'
      })
    }
  },
  allPassenger: async (req, res) => {
    if (req.user.userRole === 2) {
      try {
        // Star pagination
        let { search, sort, page, limit } = req.query
        search = search || { key: 'fullName', value: '' }
        sort = sort || { key: 'fullName', value: 0 }
        page = page || 1
        perPage = limit || 5

        const conditions = { search, sort, page, perPage }
        const result = await ReservationModel.getMyReservations(conditions, req.user.agentId)
        console.log(`from routes`, conditions)
        result
          ? res.status(200).send({ status: 'OK', data: result })
          : res.status(400).send({ status: 401, err: 'BAD REQUEST' })
      } catch (error) {
        res.status(400).send({ status: 401, err: 'BAD REQUEST', error_code: '1101' })
      }
    } else {
      res.status(401).send({
        status: 401,
        err: 'FORBIDDEN',
        message: 'UNAUTHORIZATIOON',
        error_code: '1007'
      })
    }
  },
  purchase: async (req, res) => {
    if (req.user) {
      if (await UserModel.isProfileCompleted(req.user.userId)) {
        if (req.body) {
          const { userId } = req.user
          const { userIdNumber, userIdType, seatNumber, scheduleId } = req.body
          const price = await ReservationModel.getPriceByIdSchedule(scheduleId)
          const userBalanace = await UserModel.getUserDetails(userId)
          if (userBalanace.balance > price) {
            const bookingCode = uuid().substr(0, 8).toUpperCase()
            const result = await ReservationModel.insert(
              userId,
              userIdNumber,
              userIdType,
              seatNumber,
              scheduleId,
              price,
              bookingCode
            )
            if (result) {
              const summary = await ReservationModel.reservationSummary(result.insertId)
              res.status(200).send({
                status: 'OK',
                message: 'Reservation success!',
                summary,
                currentBalance: userBalanace.balance - price
              })
            } else {
              res.status(400).send({ status: 401, err: 'BAD REQUEST' })
            }
          } else {
            res.status(200).send({
              status: 'FAILED',
              message: 'Your balance is not enought',
              data: userBalanace,
              reservationsPrice: price
            })
          }
        } else {
          res.status(400).send({ status: 401, err: 'BAD REQUEST' })
        }
      } else {
        res.status(400).send({ status: false, message: 'Please complete your profile first' })
      }
    } else {
      res.status(401).send({ status: 401, err: 'UNAUTHORIZED' })
    }
  }
}
