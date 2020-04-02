const router = require('express').Router()

const BusController = require('../controllers/Buses')
const BusModel = require('../models/Buses')

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
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      next(null, true)
    } else {
      next({ message: 'Only .png, .jpg and .jpeg format allowed!', code: 'FORMATTYPE' }, false)
    }
  }
})
/**
 * Create Bus,  and admin only
 */
router.post('/', upload.single('picture'), BusController.createBus)
router.patch('/:id', upload.single('picture'), BusController.updateBus)
router.get('/', BusController.getAllBus)
router.get('/:id', BusController.getSingleBus)
router.get('/agent/:id', BusController.all)

module.exports = router
