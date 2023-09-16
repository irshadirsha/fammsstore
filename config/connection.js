const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)
const URL = process.env.MONGO
// const URL = 'mongodb://127.0.0.1:27017/famms'
console.log("Connection Success",URL );

const DB=mongoose.connect(URL).then((data) => {                                                
})


module.exports=DB

// const URL = 'mongodb://127.0.0.1:27017/famms'