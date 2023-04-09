const mongoose=require('mongoose')
require('../config/connection')
const userWishListSchema=new mongoose.Schema({
    wishlistproduct:{
        type:Array,
        require:true,
    },
    user:{
    type:String,
    require:true
    }

})

const userWishlist_details=new mongoose.model("userwishlistdata",userWishListSchema)
module.exports=userWishlist_details;
