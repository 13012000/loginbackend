import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


mongoose.connect("mongodb://localhost:27017/myloginDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () =>{
    console.log("Db Connected")
})


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})



const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res)=> {
    const {email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            if(password === user.password){
                res.send({message: "Login Successfull",status:true, user: user})
            } else {
                res.send({message: "Password didn't match"})
            }
        } else{
            res.send({message: "User not Registered",status:false})
        }
    })
})

app.post("/register", (req, res)=> {
    const {name, email, password, repassword} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User Already Registered"})
        } else {
            const user = new User({
                name,
                email,
                password,
                repassword,
            })
            user.save(err =>{
                if(err){
                    res.send(err)
                } else {
                    res.send( {message : "Successfully Registered, Now you can Login! "} )
                }
            })
        }
    })
   
})

app.listen(9002,() => {
    console.log("Be started at port 9002");
})