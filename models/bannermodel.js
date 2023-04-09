const mongoose=require('mongoose')

require('../config/connection')

const BannerSchema=new mongoose.Schema({
    bannerpicture:{
        type:Array,
        require:true
    },
    maintitle1:{
        type:String,
        
    },
    maintitle2:{
        type:String,      
    },
    status:{
        type:Boolean,
       
    },
    bannerid:{
        type:String,
       
    }   
})

const banner_details=new mongoose.model("adminbannerdata",BannerSchema)
module.exports=banner_details;