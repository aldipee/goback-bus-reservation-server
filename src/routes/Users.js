const router = require('express').Router()
const UserController = require('../controllers/Users')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: 'files/users/',
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, next) => {
    console.log(file)
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      next(null, true)
    } else {
      next({ message: 'Only .png, .jpg and .jpeg format allowed!', code: 'FORMATTYPE' }, false)
    }
  }
})

router.get('/', UserController.allData)
router.post('/update', upload.single('avatart'), UserController.updateUser)
router.patch('/:id', UserController.delete)
router.put('/update-picture', upload.single('avatart'), UserController.updateUserPicture)
router.delete('/:id', UserController.delete)
router.get('/profile', UserController.userProfile)
router.get('/details/:id', UserController.userDetail)
router.get('/history', UserController.userHistory)
router.get('/profile/:id', UserController.singleUserProfile)

module.exports = router
