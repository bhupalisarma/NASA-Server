import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(err){
            res.status(500).send({message: "Server Error"})
        } else if(user){
            if(password === user.password ) {
                console.log("User logged in")
                res.send({message: "Login Successfull", user: user})
            } else {
                res.status(400).send({ message: "Password didn't match"})
            }
        } else {
            res.status(400).send({message: "User not registered"})
        }
    })
}) 

app.post("/signup", (req, res)=> {
    const { name, email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(err){
            res.status(500).send({message: "Server Error"})
        } else if(user){
            res.status(400).send({message: "User already registerd"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if(err) {
                    res.status(500).send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 

app.listen(9002,() => {
    console.log("Server started at port 9002")
})