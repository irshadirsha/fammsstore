const mongoose=require('mongoose')

require('../config/connection')
const userCartSchema=new mongoose.Schema({
    products:{
        type:Array,
        require:true,
    },
    user:{
    type:String,
    require:true
    }

})

const userCart_details=new mongoose.model("usercartdata",userCartSchema)
module.exports=userCart_details;
