
const dotenv=require('dotenv')
const express=require("express")
const mongoose=require("mongoose");
const cors=require('cors')
const userroutes = require("./routes/userroutes");

const app=express();
const port=5700;

dotenv.config()
app.use(cors());
app.use(express.json()); 



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
console.log("mongodb connected successfully")
})
.catch((error)=>{
  console.log("oops! failed to connect with mongodb",error)
})


app.use("/user", userroutes);
app.listen(port,()=>{
  console.log(`server connected and running at port ${port}`)
})
