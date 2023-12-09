const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/registration").then(()=>{
    console.log("Connection Successfull!!");
}).catch((e)=>{
    console.log("Not Connected!!")
})