var express = require('express');
var router = express.Router();

const adminget=require('../controlers/admin-ctr');
const adminpost=require('../controlers/admin-ctr')
const session=require('../middleware/session')
const nocache = require("nocache");
const adminNotLogin=require('../middleware/session')


router.get('/admin-login',adminNotLogin.sessionNotAdminLogin,nocache(),adminget.adminGetlogin)
router.get('/admin-dashbord',session.adminSession,adminget.adminDashBord)
router.get('/admin-product',session.adminSession,adminget.adminGetProduct)
router.get('/admin-addproduct',session.adminSession,adminget.adminGetAddproduct)
router.get('/admin-updateproduct/:id',session.adminSession,adminget.adminGetUpdateproduct)
router.get('/admin-viewuser',session.adminSession,adminget.adminGetViewuser)
router.get('/admin-category',session.adminSession,adminget.adminGetCategory)
router.get('/delete/:id',adminget.adminDeleteProduct)
router.get('/admin-updatecategory/:id',session.adminSession,adminget.adminGetUpdateCategory)
router.get('/remove/:id',adminget.adminGetRemoveCategory)
router.get('/block/:id',adminget.adminGetBlock)
router.get('/unblock/:id',adminget.adminGetUnblock)
router.get('/deleteuser/:id',adminget.adminGetDeleteuser)
router.get('/admin-logout',adminget.adminGetLogout)
router.get('/admin-viewproducts',session.adminSession,adminget. adminGetViewProduct)
router.get('/Restore',session.adminSession,adminget.adminGetRestore)
router.get('/admin-orderlist',session.adminSession,adminget.adminGetOrderList)
router.get('/admin-orderdetails',session.adminSession,adminget.adminGetOrderDetails)
router.get('/admin-orderdetails/:id',session.adminSession,adminget.adminGetOrderWithout)
router.get('/admin-banner',session.adminSession,adminget.adminGetBanner)
router.get('/disablebanner/:id',session.adminSession,adminget.adminGetBannerDisable)
router.get('/enablebanner/:id',session.adminSession,adminget.adminGetEnableBanner)
router.get('/admin-coupen',session.adminSession,adminget.adminGetCoupen)
router.get('/coupenremove/:id',session.adminSession,adminget.adminGetCoupenRemove)
router.get('/coupenenable/:id',session.adminSession,adminget.adminGetEnableCoupen)
router.get('/cancel/:id',session.adminSession,adminget.adminGetCancelOrder)
router.get('/pending/:id',session.adminSession,adminget.adminGetPendingOrder)
router.get('/delivered/:id',session.adminSession,adminget.adminGetDeliveredOrder)
router.get('/confirm/:id',session.adminSession,adminget.adminGetConfirmOrder)
router.get('/admin-salesReport',session.adminSession,adminget.adminGetSalesReport)
 router.get('/salesReports',session.adminSession,adminget.userGetSalesReportDaily)

// post method
router.post('/login-admin',adminget.adminPostLogin)
router.post('/productadding',session.adminSession,adminpost.adminPostAddProduct)
router.post('/productupdate/:id',session.adminSession,adminpost.adminUpdateProduct)
router.post('/categoryadding',session.adminSession,adminpost.adminAddCategory)
router.post('/productcategory/:id',session.adminSession,adminpost.adminPostUpdateCategory)
router.post('/bannerinsert',session.adminSession,adminpost.adminPostBanner)
router.post('/coupeninsert',session.adminSession,adminget.adminPostCoupen)

module.exports = router;
