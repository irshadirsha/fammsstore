const mongoose=require('mongoose')

require('../config/connection')
const adminOrderSchema=new mongoose.Schema({
    ordereduser:{
        type:String,
        require:true
    },
    deliveryaddress:{
       firstname:{
        type:String,
       },
       lastname:{
        type:String,
       },
       landmark:{
        type:String,
       },
       town:{
        type:String,
       },
       state:{
        type:String,
       },
       pincode:{
        type:Number,
       },
       phonenumber:{
        type:Number,
       },
       email:{
        type:String
       }
    },
    grandtotal:{
        type:Number,
        require:true
    },
    product:{
        type:Array,
        require:true
    },
    ordereddate:{
        type:String,
        require:true
    },
    paymentmethod:{
        type:String,
        require:true
    },
    // date:{
    //     type:String,
    //     require:true
    // },
    status:{
        type:String,
        require:true
    },
    deliverydate:{
        type:String,
        require:true
    },
    returnstatus:{
        type:String,
        require:true
    },
    salesdate:{
        type:String,
        require:true
    },
    item:{
        type:String,        
    },
    admin:{
        type:String,
    }

})

const adminOrder=new mongoose.model("userorder",adminOrderSchema)
module.exports=adminOrder;




