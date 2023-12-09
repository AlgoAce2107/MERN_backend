require('dotenv').config();
const express = require("express");
require("../src/db/connect");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const Register = require("../src/models/register");

const port = process.env.PORT || 3030 ;

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partial_path = path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partial_path);

app.get("/",(req,res) => {                                     //yaha par koi bhi page ko render("page ka naam") dene se wo render ho jata hai;
    res.render("index")
});


app.post("/register",async(req,res) => {
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phonenumber : req.body.phonenumber,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })
            const token = await registerEmployee.generateAuthToken();
            const registered = await registerEmployee.save();
            res.status(201).send(registered);
        }else{
            res.send("Password and Confirm Password do not match!!");
        }
    } catch(error){
        res.status(404).send(error);
    }
})

//login validation
app.post("/login",async(req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({email});
        if (!useremail) {
            return res.status(400).send("User does not exist");
          }
        const isMatch = bcrypt.compare(password,useremail.password);
        const token = await useremail.generateAuthToken();
        if(isMatch){
            res.status(201).send("Login Successful!!");
        } else{
            res.status(400).send("Invalid Credentials!!");
        }
    } catch (error) {
        res.status(400).send("User does not exist");
    }
})

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});