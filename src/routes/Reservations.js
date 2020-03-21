const router = require('express').Router()

const ReservationModel = require('../models/Reservations')

router.get('/schedules', async (req, res) => {
  if (req.query) {
    try {
      const { route } = req.query
      const result = await ReservationModel.getReservationByRoute(route)
      result
        ? res.status(200).send({ status: 'OK', data: result })
        : res.status(400).send({ status: 401, err: 'BAD REQUEST' })
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
    if (req.body) {
      const { userId } = req.user
      const { userIdNumber, userIdType, seatNumber, scheduleId } = req.body
      const result = await ReservationModel.insert(
        userId,
        userIdNumber,
        userIdType,
        seatNumber,
        scheduleId
      )
      if (result) {
        const summary = await ReservationModel.reservationSummary(result.insertId)
        res.status(200).send({ status: 'OK', message: 'Reservation success!', summary })
      } else {
        res.status(400).send({ status: 401, err: 'BAD REQUEST' })
      }

    } else {
      res.status(400).send({ status: 401, err: 'BAD REQUEST' })
    }
  } else {
    res.status(401).send({ status: 401, err: 'UNAUTHORIZED' })
  }
})

module.exports = router
