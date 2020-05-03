const router = require('express').Router()
const ReservationController = require('../controllers/Reservations')

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
router.get('/all', ReservationController.allReservations)
router.get('/:id', ReservationController.singleReservation)
router.post('/purchase', ReservationController.purchase)

module.exports = router
