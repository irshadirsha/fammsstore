const mongoose=require('mongoose')

require('../config/connection')
const adminLoginSchema=new mongoose.Schema({
    adminusername:{
        type:String,
        require:true
    },
    adminpassword:{
        type:String,
        require:true
    }   
})

const adminLogin_details=new mongoose.model("admindata",adminLoginSchema)
module.exports=adminLogin_details;