const express=require("express")
const router=express.Router()
const usercontroller=require('../controllers/usercontrollers')
const prescriptionRoutes = require('../routes/prescriptionroutes')
const verifytoken = require('../middlewares/verifytoken')

router.post('/adduser',usercontroller.createuser)
router.post('/loginuser',usercontroller.userLogin)
router.get('/profile/:username', usercontroller.getProfileByUsername)
// New: fetch profile by exact userId
router.get('/profile-by-id/:userId', usercontroller.getProfileByUserId)

module.exports=router;