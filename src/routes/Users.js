const router = require('express').Router()
const UserController = require('../controllers/Users')

const UserModels = require('../models/User')

// get all users data
router.get('/', UserController.allData)

router.post('/profile', async (req, res) => {
    if (req.body && req.user) {
        // Make sure requests exists
        const { userId } = req.user
        let { fullName, bod, gender, phoneNumber, address, balance } = req.body
        // set default balance to 0 
        balance = balance || 0
        const result = await UserModels.insertUserDetails(userId, fullName, bod, gender, phoneNumber, address, balance)
        result ? res.status(201).send({ status: 'OK', message: `Thank you for completed your data ${fullName}, now you can use all of our services` }) : res.status(400).send({ status: 400, message: `BAD REQURE` })
    } else {
        res.status(403).send({ success: false, message: 'FORBIDEN' })
    }
})

// Update user data
router.patch('/:id', UserController.delete)

// Delete user data
router.delete('/:id', UserController.delete)

module.exports = router
