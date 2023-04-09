const mongoose=require('mongoose')

require('../config/connection')

const adminAddProductSchema=new mongoose.Schema({
    productname:{
        type:String,
        require:true
    },
    productid:{
        type:String,
        require:true
    },
    productprice:{
        type:Number,
        require:true
    },
    productcategory:{
        type:String,
        require:true
    },
    productbrand:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    productimage:{
        type:[],
        require:true
    },
    stock:{
        type:Number,
        require:true
    } ,
    date:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true,
    }

})

const adminAddProduct=new mongoose.model("adminaddproduct",adminAddProductSchema)
module.exports=adminAddProduct;




