const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5001
const {MONGOURI} = require('./keys')


require('./models/user')
require('./models/post')


app.use(express.json())
app.use(require('./routes/auth')) 
app.use(require('./routes/post')) 

mongoose.connect(MONGOURI);
mongoose.connection.on('connected',() =>{
    console.log("connected to mongoDB")
})

mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})


app.listen(PORT,() =>{
    console.log("server is running on ",PORT)
})





