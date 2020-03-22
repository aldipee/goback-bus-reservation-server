const router = require('express').Router()

const uuid = require('uuid').v4
const ReservationModel = require('../models/Reservations')
const UserModel = require('../models/User')

router.get('/schedules', async (req, res) => {
  if (req.query) {
    try {
      const { route } = req.query
      const result = await ReservationModel.getReservationByRoute(route)
      result ? res.status(200).send({ status: 'OK', data: result }) : res.status(400).send({ status: 401, err: 'BAD REQUEST' })
    } catch (error) {
      res.status(400).send({ status: 401, err: 'BAD REQUEST' })
    }
  } else {
    res.status(400).send({
      status: 400,
      err: 'BAD REQUEST',
      detailError: 'Please provied which route that you want'
    })
  }
})

router.post('/purchase', async (req, res) => {
  if (req.user) {
    if (await UserModel.isProfileCompleted(req.user.userId)) {
      if (req.body) {
        const { userId } = req.user
        const { userIdNumber, userIdType, seatNumber, scheduleId } = req.body
        const price = await ReservationModel.getPriceByIdSchedule(scheduleId)
        const userBalanace = await UserModel.getUserDetails(userId)
        if (userBalanace.balance > price) {
          const bookingCode = uuid()
            .substr(0, 8)
            .toUpperCase()
          const result = await ReservationModel.insert(userId, userIdNumber, userIdType, seatNumber, scheduleId, price, bookingCode)
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
})

module.exports = router
