const express=require("express")
const router=express.Router()
const usercontroller=require('../controllers/usercontrollers')
const verifytoken = require('../middlewares/verifytoken')

router.post('/adduser',usercontroller.createuser)
router.post('/loginuser',usercontroller.userLogin)

module.exports=router;