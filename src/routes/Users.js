const router = require('express').Router()

const UserController = require('../controllers/Users')

const UserModels = require('../models/User')
const ReservationModel = require('../models/Reservations')

const multer = require('multer')

const storage = multer.diskStorage({
  destination: 'files/users/',
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({
  storage,
  fileFilter: (req, file, next) => {
    console.log(file)
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      next(null, true)
    } else {
      next({ message: 'Only .png, .jpg and .jpeg format allowed!', code: 'FORMATTYPE' }, false)
    }
  }
})

// get all users data
router.get('/', UserController.allData)

router.post('/update', upload.single('avatart'), async (req, res) => {
  console.log(req.file)
  if (req.user) {
    try {
      // Make sure requests exists
      const { filename } = req.file
      const { userId } = req.user
      let { fullName, bod, gender, phoneNumber, address, balance } = req.body
      // set default balance to 0
      balance = balance || 0
      const result = await UserModels.insertUserDetails(
        userId,
        fullName,
        bod,
        gender,
        phoneNumber,
        address,
        balance,
        filename
      )
      const msg = `Thank you for completed your data ${fullName}, now you can use all of our services`
      result
        ? res.status(201).send({
            status: 'OK',
            message: msg
          })
        : res.status(400).send({ status: 400, message: 'BAD REQUEST' })
    } catch (error) {
      console.log(error)
      res.send({ status: 'Error, please try again later' })
    }
  } else {
    res.status(403).send({ success: false, message: 'FORBIDEN' })
  }
})

// Update user data
router.patch('/:id', UserController.delete)

// Delete user data
router.delete('/:id', UserController.delete)

// Profile
router.get('/profile', async (req, res) => {
  if (!req.user) {
    res.status.send({ status: 'NEED LOGIN TO ACCESS THIS PAGE' })
  } else {
    if (await UserModels.isProfileCompleted(req.user.userId)) {
      const { userId } = req.user
      const data = await UserModels.getUserDetails(userId)
      data.avatar = `//${process.env.APP_HOST}:${process.env.APP_PORT}${process.env.PUBLIC_URL}users/${data.avatar}`
      res.status(200).send({
        status: 'OK',
        msg: `Welcome back ${data.fullName}`,
        profileData: data
      })
    }
  }
})

router.get('/history', async (req, res) => {
  if (!req.user) {
    res.status.send({ status: 'NEED LOGIN TO ACCESS THIS PAGE' })
  } else {
    if (await UserModels.isProfileCompleted(req.user.userId)) {
      let { show, limit, page, sort, sortBy } = req.query
      limit = limit || 5
      page = page || 1
      const conditions = {
        page,
        limit,
        sort: (sort && sortBy && { key: sortBy, value: sort }) || { key: 'fullName', value: 1 }
      }
      show = show || 'all'
      const { userId } = req.user
      const currentTicket = await ReservationModel.getUserReservation(userId, 0, conditions)
      const pastTicket = await ReservationModel.getUserReservation(userId, 1, conditions)

      const data = {
        status: 'OK',
        yourBooking: currentTicket,
        history: pastTicket
      }
      show === 'booking' && delete data.history
      show === 'history' && delete data.yourBooking
      res.status(200).send(data)
    }
  }
})

module.exports = router
