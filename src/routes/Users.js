const router = require('express').Router()

const UserController = require('../controllers/Users')

const UserModels = require('../models/User')

const multer = require('multer')

const storage = multer.diskStorage({
  destination: 'files/users/',
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage })

// get all users data
router.get('/', UserController.allData)

router.post('/profile', upload.single('avatar'), async (req, res) => {
  if (req.body && req.user) {
    // Make sure requests exists
    const { filename } = req.file

    const { userId } = req.user
    let { fullName, bod, gender, phoneNumber, address, balance } = req.body
    // set default balance to 0
    balance = balance || 0
    const result = await UserModels.insertUserDetails(userId, fullName, bod, gender, phoneNumber, address, balance, filename)
    const msg = `Thank you for completed your data ${fullName}, now you can use all of our services`
    result
      ? res.status(201).send({
          status: 'OK',
          message: msg
        })
      : res.status(400).send({ status: 400, message: 'BAD REQUEST' })
  } else {
    res.status(403).send({ success: false, message: 'FORBIDEN' })
  }
})

// Update user data
router.patch('/:id', UserController.delete)

// Delete user data
router.delete('/:id', UserController.delete)

module.exports = router
