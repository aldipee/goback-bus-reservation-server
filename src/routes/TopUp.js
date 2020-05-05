const router = require('express').Router()
const TopUpController = require('../controllers/TopUp')

router.get('/', TopUpController.allTopUp)
// router.get('/:id', TopUpController.allData)
router.post('/add', TopUpController.addTopUp)
router.patch('/:id', TopUpController.updateTopUp)
// router.delete('/:id', TopUpController.delete)

module.exports = router
