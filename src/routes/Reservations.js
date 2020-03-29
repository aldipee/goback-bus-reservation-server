const router = require('express').Router()
const ReservationController = require('../controllers/Reservations')
const ReservationModel = require('../models/Reservations')

// router.get('/schedules', async (req, res) => {
//   if (req.query) {
//     try {
//       const { route } = req.query
//       const result = await ReservationModel.getReservationByRoute(route)
//       result
//         ? res.status(200).send({ status: 'OK', data: result })
//         : res.status(400).send({ status: 401, err: 'BAD REQUEST' })
//     } catch (error) {
//       res.status(400).send({ status: 401, err: 'BAD REQUEST' })
//     }
//   } else {
//     res.status(400).send({
//       status: 400,
//       err: 'BAD REQUEST',
//       detailError: 'Please provied which route that you want'
//     })
//   }
// })
router.get('/all-passengers', ReservationController.allPassenger)
router.get('/all', async (req, res) => {
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
      console.log(`from routes`, conditions)
      result
        ? res.status(200).send({ status: 'OK', data: result })
        : res.status(400).send({ status: 401, err: 'BAD REQUEST' })
    } catch (error) {
      res.status(400).send({ status: 401, err: 'BAD REQUEST' })
    }
  } else {
    res.status(401).send({
      status: 401,
      err: 'FORBIDDEN'
    })
  }
})
router.get('/:id', async (req, res) => {
  if (req.user.userRole === 1) {
    try {
      // Star pagination
      let { search, sort, page, limit } = req.query
      search = search || { key: 'fullName', value: '' }
      sort = sort || { key: 'fullName', value: 0 }
      page = page || 1
      perPage = limit || 5

      const conditions = { search, sort, page, perPage }
      const result = await ReservationModel.getReservationsById(req.params.id, conditions)

      console.log(result)
      result
        ? res.status(200).send({ status: 'OK', data: result })
        : res.status(400).send({ status: 401, err: 'BAD REQUEST' })
    } catch (error) {
      res.status(400).send({ status: 401, err: 'BAD REQUEST' })
    }
  } else {
    res.status(401).send({
      status: 401,
      err: 'FORBIDDEN'
    })
  }
})
router.post('/purchase', ReservationController.purchase)

module.exports = router
