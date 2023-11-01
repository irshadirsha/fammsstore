const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)
const URL = process.env.MONGO

console.log("Connection Success",URL );

const DB=mongoose.connect(URL).then((data) => {                                                
})


module.exports=DB

