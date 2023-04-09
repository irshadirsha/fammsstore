const mongoose=require('mongoose')
require('../config/connection')

const userSignupSchema=new mongoose.Schema({
     fullname:{
      type:String,
      require:true
     },
     username:{
        type:String,
        require:true
     },
     useremail:{
        type:String,
        require:true
     },
     password:{
        type:String,
        require:true
     },
     confirm_password:{
        type:String,
        require:true
     },
     status:{
      type:Boolean,
      require:true
     },
     usedcoupen:{
          type:Array,
          require:true
      },
      wallet:{
         type:Number,
         require:true
      }
     
})
const userSignup_details=new mongoose.model("userdata",userSignupSchema)
module.exports=userSignup_details;