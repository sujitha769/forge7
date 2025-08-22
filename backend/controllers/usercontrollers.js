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

  // Exclude sensitive fields like password from response
  const sanitized = userdetailsfrommodel.toObject();
  delete sanitized.password;
  res.status(200).json(sanitized)
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

// Fetch profile by exact userId (shown in client Profile as "User ID")
const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !userId.trim()) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const user = await usermodel.findOne({ userId: userId.trim() }).select('-password');
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

const updateProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { name, email, specialization, experience, phone } = req.body;
    
    const user = await usermodel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (specialization !== undefined) user.specialization = specialization;
    if (experience !== undefined) user.experience = experience;
    if (phone !== undefined) user.phone = phone;
    
    await user.save();
    
    // Return updated user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { username } = req.params;
    const availabilityData = req.body;
    
    const user = await usermodel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update availability
    user.availability = availabilityData;
    await user.save();
    
    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { username } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    const user = await usermodel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateNotifications = async (req, res) => {
  try {
    const { username } = req.params;
    const notificationData = req.body;
    
    const user = await usermodel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update notification settings
    user.notifications = notificationData;
    await user.save();
    
    res.json({ message: 'Notification settings updated successfully' });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTheme = async (req, res) => {
  try {
    const { username } = req.params;
    const themeData = req.body;
    
    const user = await usermodel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update theme settings
    user.theme = themeData;
    await user.save();
    
    res.json({ message: 'Theme settings updated successfully' });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createuser,
  userLogin,
  getallusers,
  getuserbyid,
  getProfileByUsername,
  getProfileByUserId,
  searchUsers,
  updateAvatar,
  upload,
  updateUsername,
  updateProfile,
  updateAvailability,
  changePassword,
  updateNotifications,
  updateTheme
};