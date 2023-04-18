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
    try {
        res.render('admin-login', { errmsg })
        errmsg = null   
    } catch (error) {
       console.log(error)    
       next()
    }
       
}
const adminDashBord = async function (req, res, next) {
    try {
        let totalrevenue
        let admin = req.session.admin
        
            let usercount = await userdata.find().count()
            let blockeduser= await userdata.find({status:false}).count()
            console.log(blockeduser);
            let ordercount = await userorder.findOne({ status: "delivered" }).count()
            let revenue = await userorder.aggregate([{ $match: { status: "delivered" } }, { $unwind:"$product" }, { $group: { _id: null, sum: { $sum: "$product.totalprice" } } }, { $project: { _id: 0 } }])
            console.log(revenue);
            if (revenue.length != 0) {
                totalrevenue = revenue[0].sum 
            } else {
                totalrevenue = 0
            }
            console.log("rrrrrrrrrrrrrrrrrrrrrrr");
            console.log(ordercount);
            console.log(usercount);
            let pendingordercount = await userorder.findOne({ status: "shipped" }).count()
            console.log("counttttttttttttttttttt",pendingordercount);
            res.render('admin-dashbord', { usercount, ordercount, totalrevenue, pendingordercount ,blockeduser})  
    } catch (error) {
        console.log(error)  
        next()
    }
    
}

const adminGetProduct = async function (req, res, next) { 
    try {
        let producttable = await adminaddproduct.find({ status: { $nin: false } })
        res.render('admin-product', { producttable })  
    } catch (error) {
        console.log(error)  
        next()
    } 
        
}

const adminGetAddproduct = async function (req, res, next) {  
    try {
        let categoryadd = await adminproductcategory.find()
        res.render('admin-addproduct', { categoryadd }) 
    } catch (error) {
        console.log(error)  
        next()  
    } 
        
}
const adminGetUpdateproduct = async function (req, res, next) {
  try {
    id = req.params.id
    const edit = await adminaddproduct.find({ _id: id })
    console.log(edit);
     categoryupdt = await adminproductcategory.find()
     console.log(categoryupdt);
   
        res.render('admin-updateproduct', { edit, categoryupdt })
  } catch (error) {
    console.log(error)  
    next()  
  }
       
}
const adminGetViewuser = async function (req, res, next) {
    try {
        let listtable = await userdata.find()
        res.render('admin-viewuser', { listtable })  
    } catch (error) {
        console.log(error)  
        next()  
    }
       
}
const adminGetCategory = async function (req, res, next) {
    try {
        let categorytable = await adminproductcategory.find()
        res.render('admin-category', { categorytable, categoryerror })
        categoryerror = null; 
    } catch (error) {
        console.log(error)  
        next()
    }
       
}
const adminDeleteProduct = async function (req, res, next) {
    try {
        let id = req.params.id
        console.log("parammmsssssssssssssssssssidd",id);
        await adminaddproduct.updateOne({ _id: id }, { $set: { status: false } })
        // res.redirect('/admin-product') 
        res.json({status:true})
    } catch (error) {
        console.log(error)  
        next()
    }
    
}

const adminGetRestore = async function (req, res, next) {
    try {
        let restoreid = req.params.id
        await adminaddproduct.updateOne({ _id: restoreid }, { $set: { staus: true } })
        res.redirect('/admin-product')
    } catch (error) {
        console.log(error)  
        next()
    }
   
}
const adminGetUpdateCategory = async function (req, res, next) {
    try {
        admin = req.session.admin
        if (admin) {
            categoryid = req.params.id
            const categoryedit = await adminproductcategory.find({ _id: categoryid })
            res.render('admin-updatecategory', { categoryedit })
        } else {
            res.redirect('/admin-login')
        }
    } catch (error) {
        console.log(error)  
        next()  
    }
   
}
const adminGetRemoveCategory = async function (req, res, next) {
    try {
        let removid = req.params.id
        await adminproductcategory.deleteOne({ _id: new ObjectId(removid) })
        // res.redirect('/admin-category')
        res.json({status:true})
    } catch (error) {
        console.log(error)  
        next()  
    }
   
}
const adminGetBlock = async function (req, res, next) {
    try {
        let blockid = req.params.id
    // console.log(blockid);
    await userdata.updateOne({ _id: blockid }, {
        $set: {
            status: false
        }
    })

    res.redirect('/admin-viewuser') 
    } catch (error) {
        console.log(error)  
        next() 
    }
   
}
const adminGetUnblock = async function (req, res, next) {
    try {
        unblockid = req.params.id
        await userdata.updateOne({ _id: unblockid }, {
            $set: {
                status: true
            }
        })
        res.redirect('/admin-viewuser')  
    } catch (error) {
        console.log(error)  
        next() 
    }
   
}

const adminGetDeleteuser = async function (req, res, next) {
    try {
        userid = req.params.id
        await userdata.deleteOne({ _id: new ObjectId(userid) })
        res.redirect('/admin-viewuser')
        // res.json({status:true})
    } catch (error) {
        console.log(error)  
        next() 
    }
   
}
const adminGetLogout = function (req, res, next) {
    try {
        if (req.session.admin) {
            req.session.admin = null
            res.redirect('/admin-login')
        } else {
            res.redirect('/admin-login')
        }
    } catch (error) {
        console.log(error)  
        next() 
    }
   
}
const adminGetViewProduct = function (req, res, next) {
    try {
        res.render('admin-viewproducts')  
    } catch (error) {
        console.log(error)  
        next() 
    }
  
}
const adminGetOrderList = async function (req, res, next) { 
    try {
        finddata = await userorder.find()
        console.log(finddata);
        res.render('admin-orderlist', { finddata })
    } catch (error) {
        console.log(error)  
        next()  
    }
   
}
const adminGetOrderWithout = function (req, res, next) {
    try {
        orderid = req.params.id
        console.log(orderid);
        res.redirect('/admin-orderdetails')
    } catch (error) {
        console.log(error)  
        next()   
    }
   
}
let orderid
const adminGetOrderDetails = async function (req, res, next) {
    try {
        let stat
        if (orderid == null) {
    
        } else {
            let orderstatus = await userorder.findOne({ _id: new ObjectId(orderid) })
            console.log(orderstatus);
             stat = orderstatus.status
            console.log(stat);
            console.log("ssssssssssss");
        }
        let dataorder = await userorder.aggregate([{ $match: { _id: new ObjectId(orderid) } }, { $unwind: "$product" }, { $project: { product: '$product.products', paymentid: '$product.products.paymentid' } }])
        console.log("kkkkkkkkkkkkkkkkk");
        console.log(dataorder);
        
        if (stat == 'delivered'||stat=='Item Returned') {
            orderid = null
            console.log(stat);
        }
        res.render('admin-orderdetails', { dataorder, orderid, stat })
    } catch (error) {
        console.log(error)  
        next()   
    }
   
}
let adminGetBanner = async function (req, res, next) {
    try {
        let bannerinfo = await adminbannerdata.find()
        console.log(bannerinfo);
        res.render('admin-banner', { bannerinfo })
    } catch (error) {
        console.log(error)  
        next()  
    }
   
}

const adminGetBannerDisable = async function (req, res, next) {
    try {
        let bannerdisable = req.params.id
    await adminbannerdata.updateOne({ _id: bannerdisable }, { $set: { status: false } })
    res.redirect('/admin-banner')
    } catch (error) {
        console.log(error)  
        next() 
    }
    
}
const adminGetEnableBanner = async function (req, res, next) {
    try {
        let bannerenable = req.params.id
        await adminbannerdata.updateOne({ _id: bannerenable }, { $set: { status: true } })
        res.redirect('/admin-banner')
    } catch (error) {
        console.log(error)  
        next() 
    }
   
}
const adminGetCoupen = async function (req, res, next) {
    try {
        let coupendetail = await admincoupendata.find()
        res.render('admin-coupen', { coupendetail }) 
    } catch (error) {
        console.log(error)  
        next() 
    }
    
}
const adminGetCoupenRemove = async function (req, res, next) {
    try {
        coupenremovid = req.params.id
        await admincoupendata.updateOne({ _id: coupenremovid }, { $set: { status: false } })
        res.redirect('/admin-coupen')  
    } catch (error) {
        console.log(error)  
        next() 
    }
   
}
const adminGetEnableCoupen = async function (req, res, next) {
    try {
        coupenenableid = req.params.id
    await admincoupendata.updateOne({ _id: coupenenableid }, { $set: { status: true } })
    res.redirect('/admin-coupen') 
    } catch (error) {
        console.log(error)  
        next() 
    }
   
}
const adminGetCancelOrder = async function (req, res, next) {
    try {
        cancelid = req.params.id
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(cancelid);
        await userorder.updateOne({ _id: new ObjectId(cancelid) }, { $set: { status: 'canceled' } })
        res.redirect('/admin-orderdetails') 
    } catch (error) {
        console.log(error)  
        next() 
    }
    
}
const adminGetPendingOrder = async function (req, res, next) {
    try {
        pendingid = req.params.id
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        console.log(pendingid);
        await userorder.updateOne({ _id: new ObjectId(pendingid) }, { $set: { status: 'Pending' } })
        res.redirect('/admin-orderdetails')
    } catch (error) {
        console.log(error)  
        next()
    }
   
}
const adminGetDeliveredOrder = async function (req, res, next) {
    try {
        deliveredid = req.params.id
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(deliveredid);
    await userorder.updateOne({ _id: new ObjectId(deliveredid) }, { $set: { statdelivered: 'fun' } })
    await userorder.updateOne({ _id: new ObjectId(deliveredid) }, { $set: { status: 'delivered' } })
    let newdate = new Date().toLocaleDateString()
    await userorder.updateOne({ _id: new ObjectId(deliveredid) }, { $set: { salesdate: newdate } })
    res.redirect('/admin-orderdetails') 
    } catch (error) {
        console.log(error)  
        next()
    }
   
}
const adminGetConfirmOrder = async function (req, res, next) {
    try {
        user=req.session.user
        confirmid = req.params.id
        console.log("hhhhhhhhhhhhhhhhhhhhhhdddddddddddddddddddd");
        console.log(confirmid);
        await userorder.updateOne({ _id: new ObjectId(confirmid) }, { $set: { status: 'Item Returned'} })
        
     
        await userorder.updateOne({ _id: new ObjectId(confirmid) }, { $set: {item:"return" } })
        await userorder.updateOne({ _id: new ObjectId(confirmid) }, { $unset: {admin:"return" } })
      
        res.redirect('/admin-orderdetails')  
    } catch (error) {
        console.log(error)  
        next()
    }
   
}
const adminGetSalesReport = async function (req, res, next) {
    try {
        let salesdatas = await userorder.aggregate([{ $match: { status: 'delivered' } }, { $unwind: "$product" }, { $project: { product: "$product.products", quantity: "$product.quantity", totalprice: "$product.totalprice", ordereduser: '$ordereduser', grandtotal: '$grandtotal', deliverydate: "$deliverydate",salesdate:"$salesdate" } }])

    console.log(salesdatas);
    if (req.session.report) {
        salesdatas = req.session.report
        res.render('admin-salesReport', { salesdatas })
        req.session.report = null
    } else {
        res.render('admin-salesReport', { salesdatas })
        
    } 
    } catch (error) {
        console.log(error)  
        next()
    }
   
    

}
const userGetSalesReportDaily = async function (req, res, next) {
    try {
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
           
           
            console.log(monthlysalesReport);
           
            req.session.report = monthlysalesReport
           
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
           
          }
        
    
        res.redirect('/admin-salesReport')
    
    } catch (error) {
        console.log(error)  
        next()
    }
   
}

//---------------------------------  admmin post method -----------------------------------//
const adminPostLogin = async function (req, res, next) {
    try {
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
    } catch (error) {
        console.log(error)  
        next()
    }
    
}
// post method admin addproduct
const adminPostAddProduct = function (req, res, next) {
    try {
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
        
    } catch (error) {
        console.log(error)  
        next()
    }
    
}
// post method admin update product
const adminUpdateProduct = async function (req, res, next) {
    try {
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
                productimage: items.productimage,
                stock:items.stock
    
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
                    productimage: items.productimage,
                    stock:items.stock
        
                }
            })
        
            res.redirect('/admin-product')
        }
       
    } catch (error) {
        console.log(error)  
        next()  
    }
    
}


// post method admin add category
const adminAddCategory = async function (req, res, next) {
    try {
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
    } catch (error) {
        console.log(error)  
        next()  
    }
   
}
// post method admin update category
const adminPostUpdateCategory = async function (req, res, next) {
    try {
        let categoryeditid = req.params.id
    
    await adminproductcategory.updateOne({ _id: categoryeditid }, {
        $set: {
            addcategory: req.body.addcategory
        }
    })

    res.redirect('/admin-category') 
    } catch (error) {
        console.log(error)  
        next()   
    }
 
}

const adminPostBanner = async function (req, res, next) {
    try {
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
    } catch (error) {
        console.log(error)  
        next()  
    }
    
}
const adminPostCoupen = async function (req, res, next) {
    try {
        console.log(req.body);
    let coupendata = req.body
     coupendata.status = true;
    await admincoupendata.insertMany([coupendata])
    res.redirect('/admin-coupen') 
    } catch (error) {
        console.log(error)  
        next()    
    }
   
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