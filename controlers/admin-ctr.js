const admindata = require('../models/adminmodels')
const fileUpload = require('express-fileupload')
fs = require('fs')
const adminaddproduct = require('../models/adminaddmodels')
const { ObjectId } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const adminproductcategory = require('../models/admincategory')
const userdata = require('../models/usermodels')
const userorder = require('../models/ordermodel')
const usercartdata = require('../models/cartmodels')
const adminbannerdata = require('../models/bannermodel')
const admincoupendata = require('../models/coupenmodel')
var session = require('express-session')
const { log } = require('console')
const adminSession=require('../middleware/session')
let errmsg
let id
let categoryid
let categoryupdt
let categoryerror
let finddata
let updateerror

const adminGetlogin = function (req, res, next) {
    let admin = req.session.admin
   
        res.render('admin-login', { errmsg })
        errmsg = null
    
}
const adminDashBord = async function (req, res, next) {
    let totalrevenue
    let admin = req.session.admin
    
        let usercount = await userdata.find().count()
        let ordercount = await userorder.findOne({ status: "delivered" }).count()
        let revenue = await userorder.aggregate([{ $match: { status: "delivered" } }, { $unwind: "$product" }, { $group: { _id: null, sum: { $sum: "$product.totalprice" } } }, { $project: { _id: 0 } }])
        console.log(revenue);
        if (revenue.length != 0) {
            totalrevenue = revenue[0].sum
        } else {
            totalrevenue = 0
        }


        console.log("rrrrrrrrrrrrrrrrrrrrrrr");
        console.log(ordercount);
        console.log(usercount);
        let pendingordercount = await userorder.findOne({ status: "Pending" }).count()
        console.log(pendingordercount);
        res.render('admin-dashbord', { usercount, ordercount, totalrevenue, pendingordercount })
   
}

const adminGetProduct = async function (req, res, next) {
    let admin = req.session.admin
    if (admin) {
        let producttable = await adminaddproduct.find({ status: { $nin: false } })
        res.render('admin-product', { producttable })
    } else {
        res.redirect('/admin-login')
    }
}

const adminGetAddproduct = async function (req, res, next) {
    let admin = req.session.admin
    if (admin) {
        let categoryadd = await adminproductcategory.find()
        res.render('admin-addproduct', { categoryadd })
    } else {
        res.redirect('/admin-login')
    }
}
const adminGetUpdateproduct = async function (req, res, next) {
    admin = req.session.admin
    if (admin) {
        id = req.params.id
        const edit = await adminaddproduct.find({ _id: id })
        console.log(edit);

        console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[");

         categoryupdt = await adminproductcategory.find()
         console.log(categoryupdt);
         console.log("]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]");
  
           
            res.render('admin-updateproduct', { edit, categoryupdt })
    
    } else {
        res.redirect('/admin-login')
    }
}
const adminGetViewuser = async function (req, res, next) {
    admin = req.session.admin
    if (admin) {
        let listtable = await userdata.find()
        res.render('admin-viewuser', { listtable })
    } else {
        res.redirect('/admin-login')
    }
}
const adminGetCategory = async function (req, res, next) {
    admin = req.session.admin
    if (admin) {
        let categorytable = await adminproductcategory.find()
        res.render('admin-category', { categorytable, categoryerror })
        categoryerror = null;
    } else {
        res.redirect('/admin-login')
    }
}
const adminDeleteProduct = async function (req, res, next) {
    let id = req.params.id
    await adminaddproduct.updateOne({ _id: id }, { $set: { status: false } })
    res.redirect('/admin-product')
}

const adminGetRestore = async function (req, res, next) {
    let restoreid = req.params.id
    await adminaddproduct.updateOne({ _id: restoreid }, { $set: { staus: true } })
    res.redirect('/admin-product')
}
const adminGetUpdateCategory = async function (req, res, next) {
    admin = req.session.admin
    if (admin) {
        categoryid = req.params.id
        const categoryedit = await adminproductcategory.find({ _id: categoryid })
        res.render('admin-updatecategory', { categoryedit })
    } else {
        res.redirect('/admin-login')
    }
}
const adminGetRemoveCategory = async function (req, res, next) {
    let removid = req.params.id
    await adminproductcategory.deleteOne({ _id: new ObjectId(removid) })
    res.redirect('/admin-category')
}
const adminGetBlock = async function (req, res, next) {
    let blockid = req.params.id
    // console.log(blockid);
    await userdata.updateOne({ _id: blockid }, {
        $set: {
            status: false
        }
    })

    res.redirect('/admin-viewuser')
}
const adminGetUnblock = async function (req, res, next) {
    unblockid = req.params.id
    await userdata.updateOne({ _id: unblockid }, {
        $set: {
            status: true
        }
    })
    res.redirect('/admin-viewuser')
}

const adminGetDeleteuser = async function (req, res, next) {
    userid = req.params.id
    await userdata.deleteOne({ _id: new ObjectId(userid) })
    res.redirect('/admin-viewuser')
}
const adminGetLogout = function (req, res, next) {
    if (req.session.admin) {
        req.session.admin = null
        res.redirect('/admin-login')
    } else {
        res.redirect('/admin-login')
    }
}
const adminGetViewProduct = function (req, res, next) {
    res.render('admin-viewproducts')
}
const adminGetOrderList = async function (req, res, next) { 
    finddata = await userorder.find()
    console.log(finddata);
    //  let datass=finddata.product[0].products
    //       console.log(datass)    
    //      let orders=await userorder.aggregate([{$unwind:"$product"}])
    //      console.log(orders);  
    res.render('admin-orderlist', { finddata })
}
const adminGetOrderWithout = function (req, res, next) {
    orderid = req.params.id
    console.log(orderid);
    res.redirect('/admin-orderdetails')
}
let orderid
const adminGetOrderDetails = async function (req, res, next) {
    let stat
    if (orderid == null) {

    } else {
        let orderstatus = await userorder.findOne({ _id: new ObjectId(orderid) })
        console.log(orderstatus);
         stat = orderstatus.status
        console.log(stat);
        console.log("ssssssssssss");
    }

    // console.log(orderdata);
    // let info=orderdata.product[0].products
    // console.log(info);
    let dataorder = await userorder.aggregate([{ $match: { _id: new ObjectId(orderid) } }, { $unwind: "$product" }, { $project: { product: '$product.products', paymentid: '$product.products.paymentid' } }])
    console.log("kkkkkkkkkkkkkkkkk");
    console.log(dataorder);
    
    if (stat == 'delivered'||stat=='Item Returned') {
        orderid = null
        console.log(stat);
    }
    res.render('admin-orderdetails', { dataorder, orderid, stat })


}

let adminGetBanner = async function (req, res, next) {
    let bannerinfo = await adminbannerdata.find()
    console.log(bannerinfo);

    res.render('admin-banner', { bannerinfo })
}

const adminGetBannerDisable = async function (req, res, next) {
    let bannerdisable = req.params.id
    await adminbannerdata.updateOne({ _id: bannerdisable }, { $set: { status: false } })
    res.redirect('/admin-banner')
}
const adminGetEnableBanner = async function (req, res, next) {
    let bannerenable = req.params.id
    await adminbannerdata.updateOne({ _id: bannerenable }, { $set: { status: true } })
    res.redirect('/admin-banner')
}
const adminGetCoupen = async function (req, res, next) {
    let coupendetail = await admincoupendata.find()

    res.render('admin-coupen', { coupendetail })
}
const adminGetCoupenRemove = async function (req, res, next) {
    coupenremovid = req.params.id
    await admincoupendata.updateOne({ _id: coupenremovid }, { $set: { status: false } })
    res.redirect('/admin-coupen')
}
const adminGetEnableCoupen = async function (req, res, next) {
    coupenenableid = req.params.id
    await admincoupendata.updateOne({ _id: coupenenableid }, { $set: { status: true } })
    res.redirect('/admin-coupen')
}
const adminGetCancelOrder = async function (req, res, next) {
    cancelid = req.params.id
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(cancelid);
    await userorder.updateOne({ _id: new ObjectId(cancelid) }, { $set: { status: 'canceled' } })
    res.redirect('/admin-orderdetails')
}
const adminGetPendingOrder = async function (req, res, next) {
    pendingid = req.params.id
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(pendingid);
    await userorder.updateOne({ _id: new ObjectId(pendingid) }, { $set: { status: 'Pending' } })
    res.redirect('/admin-orderdetails')
}
const adminGetDeliveredOrder = async function (req, res, next) {
    deliveredid = req.params.id
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(deliveredid);
    await userorder.updateOne({ _id: new ObjectId(deliveredid) }, { $set: { status: 'delivered' } })
    let newdate = new Date().toLocaleDateString()
    await userorder.updateOne({ _id: new ObjectId(deliveredid) }, { $set: { salesdate: newdate } })
    res.redirect('/admin-orderdetails')
}
const adminGetConfirmOrder = async function (req, res, next) {
    user=req.session.user
    confirmid = req.params.id
    console.log("hhhhhhhhhhhhhhhhhhhhhhdddddddddddddddddddd");
    console.log(confirmid);
    await userorder.updateOne({ _id: new ObjectId(confirmid) }, { $set: { status: 'Item Returned'} })
    
 
    await userorder.updateOne({ _id: new ObjectId(confirmid) }, { $set: {item:"return" } })
    await userorder.updateOne({ _id: new ObjectId(confirmid) }, { $unset: {admin:"return" } })
  
    res.redirect('/admin-orderdetails')
}
const adminGetSalesReport = async function (req, res, next) {
    
    let salesdatas = await userorder.aggregate([{ $match: { status: 'delivered' } }, { $unwind: "$product" }, { $project: { product: "$product.products", quantity: "$product.quantity", totalprice: "$product.totalprice", ordereduser: '$ordereduser', grandtotal: '$grandtotal', deliverydate: "$deliverydate",salesdate:"$salesdate" } }])

    console.log(salesdatas);
    if (req.session.report) {
        salesdatas = req.session.report
        res.render('admin-salesReport', { salesdatas })
        req.session.report = null
    } else {
        res.render('admin-salesReport', { salesdatas })
        
    }
    

}
const userGetSalesReportDaily = async function (req, res, next) {
    salesParam = req.query.name
    console.log(salesParam);
    if (salesParam == "day") {
       
        const today = new Date();
        const todayDate = today.toLocaleDateString();

        // Get tomorrow's date
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowDate = tomorrow.toLocaleDateString();

        // Output the dates
        console.log(todayDate);
        console.log(tomorrowDate);



        dailysalesReport = await userorder.aggregate([

            {
                $unwind: "$product"
            },
            {
                $match: { status: "delivered" }
            },
            {
                $match: {
                    salesdate: { $gte: todayDate, $lte: tomorrowDate }
                }
            }, { $project: { product: "$product.products", quantity: "$product.quantity", totalprice: "$product.totalprice", ordereduser: '$ordereduser', grandtotal: '$grandtotal', deliverydate: "$deliverydate",salesdate:"$salesdate" } }
        ])

        console.log("dddddddddddddddddddddddddddddddddddddddddddddddd");
        console.log(dailysalesReport);
        req.session.report = dailysalesReport
    } else if (salesParam == "month"){

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toLocaleDateString();
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).toLocaleDateString();
      
        console.log(firstDayOfMonth);
        console.log(lastDayOfMonth);

      
        monthlysalesReport = await userorder.aggregate([

            {
                $unwind: "$product"
            },
            {
                $match: { status: "delivered" }
            },
            {
                $match: {
                    salesdate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
                }
            }, { $project: { product: "$product.products", quantity: "$product.quantity", totalprice: "$product.totalprice", ordereduser: '$ordereduser', grandtotal: '$grandtotal', deliverydate: "$deliverydate",salesdate:"$salesdate" } }
        ])
       
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
        console.log(monthlysalesReport);
       
        req.session.report = monthlysalesReport
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
    }else{
        lifetimesalesReport = await userorder.aggregate([
            {
              $unwind: "$product"
            },
            {
              $match: {status: "delivered" }
            },
            { $project: { product: "$product.products", quantity: "$product.quantity", totalprice: "$product.totalprice", ordereduser: '$ordereduser', grandtotal: '$grandtotal', deliverydate: "$deliverydate",salesdate:"$salesdate" }}
             
          ])
        //   console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
        //   console.log(lifetimesalesReport);
        //   console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
        //   req.session.report = lifetimesalesReport
      }
    

    res.redirect('/admin-salesReport')

}

//---------------------------------  admmin post method -----------------------------------//
const adminPostLogin = async function (req, res, next) {
    let logindata = {
        adminusername: req.body.adminusername,
        adminpassword: req.body.adminpassword
    }
    let logdata = await admindata.findOne({ adminusername: logindata.adminusername })
    if (logdata == null) {
        errmsg = "Invalid Username and Password "
        res.redirect('/admin-login')

    } else {
        if (logdata.adminpassword == logindata.adminpassword) {
            req.session.admin = logdata.adminusername
            res.redirect('/admin-dashbord')
        } else {
            errmsg = "Invalid Password"
            res.redirect('/admin-login')
        }
    }
}
// post method admin addproduct
const adminPostAddProduct = function (req, res, next) {
    let addproductdata = req.body
    addproductdata.productid = uuidv4()
    req.body.date = new Date().toLocaleString();
    let image = []
    image = req.files.productimage

    let picture = image.length
    if (picture) {

        for (i = 0; i < image.length; i++) {
            image[i].mv('./public/productimage/' + addproductdata.productid + i + '.jpg')
            image[i] = addproductdata.productid + i + '.jpg'
        }
        addproductdata.productimage = image
    } else {
        image.mv('./public/productimage/' + addproductdata.productid + '.jpg')
        console.log(req.files.productimage)

        addproductdata.productimage = addproductdata.productid + '.jpg'
    }
    //   console.log(req.file.productimage);
    adminaddproduct.insertMany([addproductdata])
    res.redirect('/admin-product')
}
// post method admin update product
const adminUpdateProduct = async function (req, res, next) {
    if(req.files){
        const editid = req.params.id
    let items = req.body
    let image = []
    image = req.files.productimage
    if (image.length > 1) {
        for (var i = 0; i < image.length; i++) {
            image[i].mv('./public/productimage/' + items.productid + i + '.jpg')
            image[i] = items.productid + i + '.jpg'
        }

        items.image = image
    } else {
        image.mv('./public/productimage/' + items.productid + '.jpg')
        items.image = items.productid + '.jpg'
    }
    console.log(items + "aaaaaqqqwwwwwsssssssddddd")
    await adminaddproduct.updateOne({ _id: editid }, {
        $set: {
            productname: items.productname,
            productid: items.productid,
            productbrand: items.productbrand,
            productprice: items.productprice,
            productcategory: items.productcategory,
            productimage: items.productimage

        }
    })

    res.redirect('/admin-product')
    }else{
        const editid = req.params.id
        let items = req.body
        let image = []
        
        
           
        
        console.log(items + "aaaaaqqqwwwwwsssssssddddd")
        await adminaddproduct.updateOne({ _id: editid }, {
            $set: {
                productname: items.productname,
                productid: items.productid,
                productbrand: items.productbrand,
                productprice: items.productprice,
                productcategory: items.productcategory,
                productimage: items.productimage
    
            }
        })
    
        res.redirect('/admin-product')
    }
   
}


// post method admin add category
const adminAddCategory = async function (req, res, next) {
    let addcategorydata = {
        addcategory: req.body.addcategory
    }
    if (addcategorydata.addcategory == "") {
        res.redirect('/admin-category')
        categoryerror = "Category Field Is Empty"
    } else {

        let checkcategory = await adminproductcategory.findOne({ addcategory: addcategorydata.addcategory })
        if (checkcategory == null) {
            adminproductcategory.insertMany([addcategorydata])
            res.redirect('/admin-category')
        } else {
            res.redirect('/admin-category')
            categoryerror = "Already exists"
        }
    }
}
// post method admin update category
const adminPostUpdateCategory = async function (req, res, next) {
  let categoryeditid = req.params.id
    
    await adminproductcategory.updateOne({ _id: categoryeditid }, {
        $set: {
            addcategory: req.body.addcategory
        }
    })

    res.redirect('/admin-category')
}

const adminPostBanner = async function (req, res, next) {
    let bannerdata = req.body
    bannerdata.status = true;
    bannerdata.bannerid = uuidv4()
    console.log('pppppppppppppp');
    console.log(bannerdata.bannerid);
    //   req.body.date=new Date().toLocaleString();
    let bannerpic = []
    console.log("dddddddddddddddddddddddddddddddddddddd");
    //  console.log(req.files.bannerpicture);
    bannerpic = req.files.bannerpicture
    console.log(bannerpic);
    bannerpic.mv('./public/bannerimages/' + bannerdata.bannerid + '.jpg')
    // bannerpic.mv('./public/b'+bannerdata.bannerid+'.jpg')
    console.log(req.files.bannerpicture)

    bannerdata.bannerpicture = bannerdata.bannerid + '.jpg'
    await adminbannerdata.insertMany([bannerdata])
    res.redirect('/admin-banner')
}
const adminPostCoupen = async function (req, res, next) {
    console.log(req.body);
    let coupendata = req.body
     coupendata.status = true;


    await admincoupendata.insertMany([coupendata])
    res.redirect('/admin-coupen')
}


module.exports = {
    adminGetlogin, adminDashBord, adminGetProduct, adminGetAddproduct, adminGetBanner, adminPostCoupen,
    adminGetUpdateproduct, adminGetViewuser, adminGetCategory, adminPostAddProduct, adminPostBanner,
    adminPostLogin, adminDeleteProduct, adminUpdateProduct, adminAddCategory, adminGetRestore, adminGetCoupenRemove,
    adminGetUpdateCategory, adminPostUpdateCategory, adminGetViewProduct, adminGetOrderList, adminGetEnableCoupen,
    adminGetRemoveCategory, adminGetBlock, adminGetUnblock, adminGetDeleteuser, adminGetLogout, adminGetOrderWithout,
    adminGetOrderDetails, adminGetBannerDisable, adminGetEnableBanner, adminGetCoupen, adminGetCancelOrder,
    adminGetPendingOrder, adminGetDeliveredOrder, adminGetConfirmOrder, adminGetSalesReport, userGetSalesReportDaily
}