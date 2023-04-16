var express = require('express');
const nocache = require('nocache');
var router = express.Router();
const bcrypt = require('bcrypt')

const userget=require('../controlers/user-ctr')

 const userpost=require('../controlers/user-ctr')
const session=require('../middleware/session')
const UserNotLogin=require('../middleware/session')
/* GET method. */
router.get('/',userget.userGetHome );
router.get('/user-signup',UserNotLogin.sessionNotUserLogin,nocache(),userget.userGetSignup);
router.get('/user-login',UserNotLogin.sessionNotUserLogin,nocache(),userget.userGetLogin) 
router.get('/user-otpemail',userget.userGetOtp)
router.get('/changepassword',userget.userChangePassword)
router.get('/user-otp',userget.userGetOtpVerification)
router.get('/product-details',userget.UserGetSingleProduct)
router.get('/product-details/:id',userget.UserGetSingleProductId)
router.get('/user-shopcart',session.sessioncheck,userget.userGetShopCart)
router.get('/check-out',session.sessioncheck,nocache(),userget.UserGetCheckOut)
router.get('/changepassemail',nocache(),userget.UserGetEmailChangePass)
router.get('/changeotpv',nocache(),userget.UserChangeOtp)
router.get('/user-shop',userget.UserGetUserShopProduct)
router.get('/categorypass/:addcategory',userget.UsergetCategoryPass)
router.get('/allcategory',userget.UserGetAllProduct)
router.get('/user-profile',session.sessioncheck,userget.UserGetUserProfile)
router.get('/user-logout',userget.UserGetUserLogOut)
router.get('/cart-delete/:id/:items',userget.UserGerDeleteCart)
router.get('/user-orderstatus',session.sessioncheck,userget.userGetOrderStatus)
router.get('/editaddress',session.sessioncheck,userget.userGetEditAddress)
router.get('/addresspass/:indexof',userget.UserGetAddressPass)
router.get('/user-change',userget.userGetCpange)
router.get('/order-list',session.sessioncheck,userget.UserOrderList)
router.get('/ordered-productdata/:id',session.sessioncheck,userget.userOrderedProductData)
router.get('/ordered-productdata',session.sessioncheck,userget.UserOrderProductwithoutId)
router.get('/filterbelon',userget.userGetFilterBelone)
router.get('/filterfive',userget.userGetFilterabovefive)
router.get('/filterthousd',userget.userGetFilterabovethousand)
router.get('/filterabtwo',userget.userGetFilterabovetwothousand)
router.get('/wish-List/:id',userget.userGetWishList)
router.get('/wish-List',userget.userGetWishListWithoutId)
router.get('/whishlistshow',session.sessioncheck,userget.UserGetWishListShow)
router.get('/deletewishlist/:productid',userget.userGetDeleteWishlist)
router.get('/addtowallet/:id/:grandtotal',session.sessioncheck,userget.userAddToWallet)
router.get('/cancelorder/:id',userget.UserGetCancelOrder)

/* post method. */
router.post('/signup',userpost.userPostSignup )
router.post('/login',userpost.userPostLogin)
router.post('/otpemail',userpost.userPostOtpLogin)
router.post('/otpverification',userget.userPostOtp)
router.post('/userchangeotp',userpost.userPostChageEmail)
router.post('/otpverification2',userpost.UserChangeOtpVer)
router.post('/passchange',userpost.UserPostPassChanegeVer)
router.post('/user-shopcart/:id',session.sessioncheck,userpost.UserPostShopCart)
router.post('/update-quantity',session.sessioncheck,userpost.userPostUpdateQuantity)
router.post('/usersaddress',session.sessioncheck,userpost.UserPostAddress)
router.post('/passwordchange',session.sessioncheck,userpost.UserProfilePassChange)
router.post('/orderlistpass',session.sessioncheck,userget.userPostOrderListPass)
router.post('/verify-payment',session.sessioncheck,userpost.userGetverifypayment)
router.post('/coupentry',session.sessioncheck,userpost.UserTryCoupen) 
router.post('/getProducts',userpost.UserPostSearch)

 
module.exports = router;