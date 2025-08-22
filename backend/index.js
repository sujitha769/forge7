
const dotenv=require('dotenv')
const express=require("express")
const mongoose=require("mongoose");
const cors=require('cors')
const path = require('path');
const userroutes = require("./routes/userroutes");
const prescriptionRoutes = require("./routes/prescriptionroutes");
const reportRoutes = require("./routes/reportroutes");

const app=express();
const port=5700;

dotenv.config()
app.use(cors());
app.use(express.json()); 

// Serve uploaded files with absolute path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
console.log("mongodb connected successfully")
})
.catch((error)=>{
  console.log("oops! failed to connect with mongodb",error)
})

app.use("/user", userroutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/reports", reportRoutes);

app.listen(port,()=>{
  console.log(`server connected and running at port ${port}`)
})
