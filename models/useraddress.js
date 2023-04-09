const mongoose=require('mongoose')
require('../config/connection')

const userAddressSchema=new mongoose.Schema({
   
     address:{
        type:Array,
        require:true
     },
     user:{
        type:String,
        require:true
     }
})
const userAddress_details=new mongoose.model("useraddress",userAddressSchema)
module.exports=userAddress_details;