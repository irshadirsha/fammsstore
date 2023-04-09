const mongoose=require('mongoose')

require('../config/connection')
const CoupenSchema=new mongoose.Schema({
    coupencode:{
        type:String,
        require:true
    },
    discountvalue:{
        type:Number,
        require:true
    },
    createdate:{
        type:String,
        require:true      
    },
    minpurchese:{
        type:Number,
        require:true
    },
    expiredate:{
        type:String,
        require:true
    }, 
    discounttype:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    },
    maxamount:{
        type:String,
        require:true
    }
})

const coupen_details=new mongoose.model("admincoupendata",CoupenSchema)
module.exports=coupen_details;