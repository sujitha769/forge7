const usermodel=require('../models/usermodel');
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
const multer = require('multer');
const path = require('path');
dotenv.config()

const secretkey=process.env.WHATISNAME

const createuser=async (req,res)=>{
  try{
  const {name, username, email, password, phone, address, emergencyContact, dateOfBirth, role}=req.body;


  const existingUser = await usermodel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already registered" });
    }

    const hashedpassword=await bcrypt.hash(password,10)


  const userdetailsfrommodel=new usermodel({
    name,
    username,
    email,
    password:hashedpassword,
    phone: phone || null,
    address: address || null,
    emergencyContact: emergencyContact || null,
    dateOfBirth: dateOfBirth || null,
    role: role || 'client'
  })
  await userdetailsfrommodel.save();

  res.status(200).json(userdetailsfrommodel)
  console.log("registered") 
  }
catch(error){
  console.log("failed due some reason",error)
  res.status(500).json({error:"server error"})

}

};



const userLogin=async(req,res)=>{
  const {email,password}=req.body;
  try {
    const userthere=await usermodel.findOne({email});
    if(!userthere || !(await bcrypt.compare(password,userthere.password))){
      return res.status(404).json({error:"invalid user name or password"})
    }
    const token=jwt.sign({userid:userthere._id},secretkey,{expiresIn:"1h"})
    res.status(200).json({success:"login successfull",token, username: userthere.username, role: userthere.role})
    console.log(email)
    console.log(token)
  } catch (error) {
    console.log("login failed",error)
    
  }
}


const getallusers=async(req,res)=>{
  try {
    const getuser=await usermodel.find().populate('activity');
    res.json({getuser})
    
  } catch (error) {
    res.status(500).json({message:"internl server error"})
  }
}



const getuserbyid=async(req,res)=>{
  const userid=req.params.apple;
  try {
    const user=await usermodel.findById(userid).populate('activity');
    if(!user){
      return res.status(404).json({error:"user not found"})
    }
    res.status(200).json(user)
    
  } catch (error) {
    res.status(404).json({error:"internal server error"})
    
  }
}

// Avatar upload storage (multer)
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    const user = await usermodel.findByIdAndUpdate(
      req.userid,
      { avatar: req.file.filename },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await usermodel.findOne({ username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


const searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const users = await usermodel
      .find({ username: { $regex: `^${q}`, $options: 'i' } })
      .select('name username email avatar');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update username of current user
const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ message: 'Username is required' });
    }
    const exists = await usermodel.findOne({ username: username.trim() });
    if (exists && exists._id.toString() !== req.userid.toString()) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    const user = await usermodel.findByIdAndUpdate(
      req.userid,
      { username: username.trim() },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports={createuser,userLogin,getallusers,getuserbyid,getProfileByUsername,searchUsers, updateAvatar, upload, updateUsername}