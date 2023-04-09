const mongoose=require('mongoose')

require('../config/connection')
const adminProductCategorySchema=new mongoose.Schema({
    addcategory:{
        type:String,
        require:true
    },
    
})


const adminProductCategory=new mongoose.model("adminproductcategory",adminProductCategorySchema)
module.exports=adminProductCategory;

