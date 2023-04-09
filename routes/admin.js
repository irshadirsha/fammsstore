var express = require('express');
var router = express.Router();

const adminget=require('../controlers/admin-ctr');
const adminpost=require('../controlers/admin-ctr')

const nocache = require("nocache");


router.get('/admin-login',nocache(),adminget.adminGetlogin)
router.get('/admin-dashbord',adminget.adminDashBord)
router.get('/admin-product',adminget.adminGetProduct)
router.get('/admin-addproduct',adminget.adminGetAddproduct)
router.get('/admin-updateproduct/:id',adminget.adminGetUpdateproduct)
router.get('/admin-viewuser',adminget.adminGetViewuser)
router.get('/admin-category',adminget.adminGetCategory)
router.get('/delete/:id',adminget.adminDeleteProduct)
router.get('/admin-updatecategory/:id',adminget.adminGetUpdateCategory)
router.get('/remove/:id',adminget.adminGetRemoveCategory)
router.get('/block/:id',adminget.adminGetBlock)
router.get('/unblock/:id',adminget.adminGetUnblock)
router.get('/deleteuser/:id',adminget.adminGetDeleteuser)
router.get('/admin-logout',adminget.adminGetLogout)
router.get('/admin-viewproducts',adminget. adminGetViewProduct)
router.get('/Restore',adminget.adminGetRestore)
router.get('/admin-orderlist',adminget.adminGetOrderList)
router.get('/admin-orderdetails',adminget.adminGetOrderDetails)
router.get('/admin-orderdetails/:id',adminget.adminGetOrderWithout)
router.get('/admin-banner',adminget.adminGetBanner)
router.get('/disablebanner/:id',adminget.adminGetBannerDisable)
router.get('/enablebanner/:id',adminget.adminGetEnableBanner)
router.get('/admin-coupen',adminget.adminGetCoupen)
router.get('/coupenremove/:id',adminget.adminGetCoupenRemove)
router.get('/coupenenable/:id',adminget.adminGetEnableCoupen)
router.get('/cancel/:id',adminget.adminGetCancelOrder)
router.get('/pending/:id',adminget.adminGetPendingOrder)
router.get('/delivered/:id',adminget.adminGetDeliveredOrder)
router.get('/confirm/:id',adminget.adminGetConfirmOrder)
router.get('/admin-salesReport',adminget.adminGetSalesReport)
router.get('/salesReports',adminget.userGetSalesReportDaily)

// post method
router.post('/login-admin',adminget.adminPostLogin)
router.post('/productadding',adminpost.adminPostAddProduct)
router.post('/productupdate/:id',adminpost.adminUpdateProduct)
router.post('/categoryadding',adminpost.adminAddCategory)
router.post('/productcategory/:id',adminpost.adminPostUpdateCategory)
router.post('/bannerinsert',adminpost.adminPostBanner)
router.post('/coupeninsert',adminget.adminPostCoupen)

module.exports = router;
