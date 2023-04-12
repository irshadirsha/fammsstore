const mongoose = require('mongoose')
var userdata = require('../models/usermodels')
let adminaddproduct = require('../models/adminaddmodels')
const { ObjectId } = require('mongodb')
const nodemailer = require('nodemailer')
const adminproductcategory = require('../models/admincategory')
var session = require('express-session')
const usercartdata = require('../models/cartmodels')
const useraddress = require('../models/useraddress')
const userorder = require('../models/ordermodel')
const adminbannerdata = require('../models/bannermodel')
const { v4: uuidv4 } = require('uuid')
const Razorpay = require('razorpay')
const { response } = require('express')
const admincoupendata = require('../models/coupenmodel')
const { rmSync } = require('fs')
const adminAddProduct = require('../models/adminaddmodels')
const userwishlistdata = require('../models/wishlistModel')
const bcrypt = require('bcrypt')
require('dotenv').config()

const req = require('express/lib/request')
var instance = new Razorpay({
  key_id:process.env.KEY_ID,
  key_secret:process.env.KEY_SECRET,
});
// let singleid
// let loginerr
// let errormassege
let otpEmail
let otp
let singledata
let changeotp
let passerr
let checkmailchange
// let categoryid
// let allproducts
let changeotpEmail
let proObj
let totalprice
let passaddress
let passerrmsg
let coupenerr
let carterr
let categories
/* GET method. */
const userGetHome = async function (req, res, next) {
  try {
  let fullname=req.session.name
    let pushdatahome = await adminaddproduct.find({ status: { $nin: false } }).limit(8)
    let defaltimg = await adminbannerdata.find({ status: true }).limit(1)
    let pushbanner = await adminbannerdata.find({ status: true }).skip(1).limit(3)
    defaltimg = defaltimg[0].bannerpicture[0] 
    res.render('user-home', { pushdatahome, fullname, pushbanner, defaltimg }); 

  } catch (error) {
    console.log(error);
    next()
  }
}
const userGetSignup = function (req, res, next) {
  try {
    let user = req.session.user
    errormassege=req.session.errormassege
    res.render('user-signup', { errormassege })
    req.session.errormassege = null;
  
  } catch (error) {
    console.log(error);
  }
 
}
const userGetLogin = function (req, res, next) {
  try {
    user = req.session.user
    let loginerr=req.session.loginerr
    if (user) {
      res.redirect('/')
    } else {
      res.render("user-login", { loginerr })
      req.session.loginerr = null;
    }
    
  } catch (error) {
    console.log(error);
    next()
  }
 
}
const userGetOtp = function (req, res, next) {
  try {
    let erremail=req.session.erremail 
  console.log("ttttttttttttttttttttttttttttttt");
  console.log(erremail);
  res.render('user-otpemail',{erremail})
  req.session.erremail = null 
  
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const userChangePassword = function (req, res, next) {
  try {
    res.render('changepassword', { passerr })
    passerr = null
  } catch (error) {
    console.log(error);
    next()
  }
 
}

const userGetOtpVerification = function (req, res, next) {
  try {
    otplogerr=req.session.otplogerr
  res.render('user-otp',{otplogerr})
  req.session.otplogerr=null
  } catch (error) {
    console.log(error);
    next()
  }
  
}

const UserGetSingleProduct = async function (req, res, next) {
  try {
    let fullname=req.session.name
    singleid=req.session.singleid
  await adminaddproduct.find({ _id: new ObjectId(singleid) }).then((details) => {
    singledata = []
    singledata = details[0]
    itemdetails = details
  })
  res.render('product-details', { singledata,fullname, itemdetails })
  
  } catch (error) {
    console.log(error);
    next()
  }

}
const UserGetSingleProductId = function (req, res, next) {
  try {
    let singleid = req.params.id
    req.session.singleid=singleid
    res.redirect('/product-details')
  } catch (error) {
    console.log(error);
    next()
  }
 
}
const userGetShopCart = async function (req, res, next) {
  try {
    let fullname=req.session.name
    user = req.session.user
  // if (user) {
  console.log("userrrrrrrrrrrrrrrrrrrrrrr")
  console.log(user);
  let cartAllProducts = await usercartdata.aggregate([
    { $match: { user: user } }, { $unwind: '$products' },
    { $project: { items: "$products.items", quantity: "$products.quantity" } },
    {
      $lookup: {
        from: 'adminaddproducts',
        localField: 'items',
        foreignField: 'productid',
        as: 'products'
      }
    },
    { $project: { items: 1, quantity: 1, products: { $arrayElemAt: ['$products', 0] } } }
  ])
  
  console.log(cartAllProducts);
  totalprice

  for (var i = 0; i < cartAllProducts.length; i++) {
    totalprice = cartAllProducts[i].quantity * cartAllProducts[i].products.productprice
    cartAllProducts[i].totalprice = totalprice
  }
  let grandtotal = 0;
  for (var i = 0; i < cartAllProducts.length; i++) {
    grandtotal += cartAllProducts[i].totalprice
  }
  let subgrandtotal = grandtotal
  grandtotal += 84
 
  coupensid = req.session.coupen
  if (coupensid) {
    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
    console.log(coupensid);
    let val = await admincoupendata.find({ coupencode: coupensid })
    min = val[0].minpurchese
    if (grandtotal < val[0].minpurchese) {
      coupenerr = "Pleace Buy Upto " + min
    } else {
      console.log(val);
      dis=val[0].discountvalue
      console.log(val[0].discountvalue);
      grandtotal -= val[0].discountvalue
      console.log(grandtotal);
      console.log(dis);
       
      var success = "Successfully Discounted ₹"+dis
      // coupensid=req.session.coupen
   await userdata.updateOne({ username: req.session.user }, { $addToSet: { usedcoupen: coupensid } })
    }
  }
  // await userdata.updateOne({ username: req.session.user }, { $addToSet: { usedcoupen: coupensid } })
  res.render('user-shopcart', { success,cartAllProducts,fullname, grandtotal, subgrandtotal, coupenerr, carterr })
  coupenerr = null;
  req.session.coupen = null
  carterr = null
  success=null
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const UserGetCheckOut = async function (req, res, next) {
  try {
    let fullname=req.session.name
    user = req.session.user
    console.log(user);
    // if (user) {
      let wall = await userdata.findOne({ username: user })
      let walletpass = wall.wallet
     
      console.log(walletpass);
      let cartAllProducts = await usercartdata.aggregate([
        { $match: { user: user } }, { $unwind: '$products' },
        { $project: { items: "$products.items", quantity: "$products.quantity" } },
        {
          $lookup: {
            from: 'adminaddproducts',
            localField: 'items',
            foreignField: 'productid',
            as: 'products'
          }
        },
        { $project: { items: 1, quantity: 1, products: { $arrayElemAt: ['$products', 0] } } }
      ])
      for (var i = 0; i < cartAllProducts.length; i++) {
        totalprice = cartAllProducts[i].quantity * cartAllProducts[i].products.productprice
        cartAllProducts[i].totalprice = totalprice
      }
      let grandtotal = 0;
      for (var i = 0; i < cartAllProducts.length; i++) {
        grandtotal += cartAllProducts[i].totalprice
      }
      let subgrandtotal = grandtotal
      grandtotal += 84
      let usercheck = await useraddress.findOne({ user: req.session.user })
      if (usercheck == null) {
        res.redirect('/user-profile')
      } else {
     
  
        if (passaddress) {
          addressdetails = passaddress
          passaddress = null
        } else {
          addressdetails = usercheck.address[0]
        }
        let walletdiscount = await userdata.findOne({ username: user })
        console.log(walletdiscount);
        price = walletdiscount.wallet
        let finalamount = grandtotal
        console.log(finalamount);
        //finalamount-=price
     
        console.log(price);
        console.log(finalamount);
        if (price > finalamount) {
          price -= finalamount
         
          console.log(price);
          req.session.walletprice = price
          finalamount = price
        } else {
          finalamount -= price
          console.log(finalamount);
          finalamount = 0
          req.session.walletprice = finalamount
        }
        let cart = await usercartdata.findOne({ user: user })
        if (cart == null) {
        
          console.log(cart);
          res.redirect('/user-shop')
        }
        if (grandtotal > walletpass) {
          walletpass = 0
        }
  
  
        res.render('check-out', { finalamount,fullname, grandtotal, walletpass, subgrandtotal, addressdetails, cartAllProducts, totalprice })
      }
    // } else {
    //   res.redirect('/user-login')
    // }
  } catch (error) {
    console.log(error);
    next()
  }
 
}
const UserGetEmailChangePass = function (req, res, next) {  
  try {
    let changeemail=req.session.changeemail
    res.render('changepassemail',{changeemail})
    req.session.changeemail=null
  } catch (error) {
    console.log(error);
    next()
  }

}
const UserChangeOtp = function (req, res, next) {
  try {
    let changeotperr=req.session.changeotperr
  res.render('changeotpv',{changeotperr})
  req.session.changeotperr=null
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const UserGetAllProduct = async function (req, res, next) {
  try {
     // let pushdata=await adminaddproduct.find({status:{$nin:false}})
  // let categories=await adminproductcategory.find()
  // console.log(allproducts);
  // res.render('user-shop',{pushdata,categories})
  res.redirect('/user-shop')

  } catch (error) {
    console.log(error);
    next()
  }
 

}
const UserGetUserShopProduct = async function (req, res, next) {
  try {
    user = req.session.user
    let fullname=req.session.name
  // if (user) {
   let categoryid=req.session.categoryid
  if (categoryid == null) {
    let pushdata = await adminaddproduct.find({ status: { $nin: false } })
    categories = await adminproductcategory.find()

    res.render('user-shop', { pushdata,fullname, categories })
  } else {
    let pushdata = await adminaddproduct.find({ status: { $nin: false } })
    categories = await adminproductcategory.find({})
    pushdata = await adminaddproduct.find({ $and: [{ productcategory: categoryid }, { status: { $nin: false } }] })
    res.render('user-shop', { pushdata,fullname, categories })
    categoryid = null
  }

  // } else {
  //   res.redirect('/user-login')
  // }
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const UsergetCategoryPass = function (req, res, next) {
  try {
    req.session.categoryid = req.params.addcategory

  res.redirect('/user-shop')
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const UserGetUserProfile = async function (req, res, next) {
  try {
    user = req.session.user
    let fullname=req.session.name
    // if (user) {
      let userinformation = await userdata.find({ username: user })
      let addressinfo = await useraddress.findOne({ user: user })
      let walletshow = await userdata.findOne({ username: user })
      res.render('user-profile', { userinformation,fullname, addressinfo, walletshow })
  
    // } else {
    //   res.redirect('/user-login')
    // }
  } catch (error) {
    console.log(error);
    next()
  }
 
}
const UserGetUserLogOut = function (req, res, next) {
  try {
    if (req.session.user) {
      req.session.user = null
      req.session.name=null
      res.redirect('/user-login')
    } else {
      res.redirect('/user-login')
    }
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const UserGerDeleteCart = async function (req, res, next) {
   try {
    cartremoveid = req.params.id
  cartitemid = req.params.items
  console.log(cartremoveid);
  console.log(cartitemid);
  await usercartdata.updateOne({ _id: cartremoveid }, { $pull: { products: { items: cartitemid } } })
  
  res.json({ status: true })
   } catch (error) {
    console.log(error);
    next()
   }
  
}
const  userGetOrderStatus = async function (req, res, next) {
  try {
    console.log("llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");
    if(req.session.quant&&req.session.productId){
      quant=-req.session.quant
      ProID=req.session.productId
      console.log(quant);
      console.log(ProID);
      await adminaddproduct.updateOne({ productid: ProID }, { $inc: { stock:quant } })
    }else{
      proId=req.session.productidd
      await adminaddproduct.updateOne({ productid: proId }, { $inc: { stock:-1 } })
    }
    
  
  res.render('user-orderstatus')
  req.session.quant=null
  req.session.productId=null
  } catch (error) {
    console.log(error);
    next()
  }

 
   
}
const userGetEditAddress = async function (req, res, next) {
  try {
    user = req.session.user
    let fullname=req.session.name
  // if (user) {
    let adds = await useraddress.findOne({ user: user })
    if (adds == null) {
      res.redirect('/user-profile')
    }

    console.log(adds)
    let alladdress = adds.address
    console.log(alladdress);
    res.render('editaddress', { alladdress,fullname })
  // } else {
  //   res.redirect('/')
  // }
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const UserGetAddressPass = async function (req, res, next) {
  try {
    user = req.session.user
  console.log("irshad");
  pasid = req.params.indexof
  console.log(pasid);
  let passadd = await useraddress.findOne({ user: user })
  passaddress = passadd.address[pasid]
  console.log(passaddress);
  res.redirect('/check-out')
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const userGetCpange = function (req, res, next) {
  try {
    res.render('user-change', { passerrmsg })
  passerrmsg = null;
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const UserOrderList = async function (req, res, next) {
  try {
    let fullname=req.session.name
    user = req.session.user
    let orderdatauser = await userorder.find({ ordereduser: user })
   
    console.log(orderdatauser);
    res.render('order-list', { orderdatauser,fullname })
  } catch (error) {
    console.log(error);
    next()
  }
 
}
const userOrderedProductData = function (req, res, next) {
  try {
    historyid = req.params.id
    res.redirect('/ordered-productdata')
  } catch (error) {
    console.log(error);
    next()
  }
 
}
let historyid
const UserOrderProductwithoutId = async function (req, res, next) {
  try {
    user = req.session.user
    let fullname=req.session.name
  console.log(historyid)
  let userorderstatus = await userorder.aggregate([{ $match: { _id: new ObjectId(historyid) } }, { $unwind: "$product" }, { $project: { product: "$product.products", grandtotal: "$grandtotal", returnstatus: "$returnstatus" } }])
  console.log(userorderstatus);
  // let removebtn=userorder.findOne({$and:[{_id:new ObjectId(historyid)},{returnstatus:false}]})
  // console.log(removebtn);

  res.render('ordered-productdata', { userorderstatus,fullname })
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const userGetFilterBelone = async function (req, res, next) {
  try {
    let fullname=req.session.name
    bellowfivehundred = await adminAddProduct.find({ $and: [{ productprice: { $gt: 0, $lt: 500 } }, { status: { $nin: false } }] })
    pushdata = bellowfivehundred
    console.log(pushdata,);
    res.render('user-shop', { pushdata, categories,fullname })
  } catch (error) {
    console.log(error);
    next()
  }
 
}
const userGetFilterabovefive = async function (req, res, next) {
  try {
    let fullname=req.session.name
    abovefivehundred = await adminAddProduct.find({ $and: [{ productprice: { $gt: 500, $lt: 1000 } }, { status: { $nin: false } }] })
  pushdata = abovefivehundred
  console.log(pushdata,);
  res.render('user-shop', { pushdata, categories,fullname })
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const userGetFilterabovethousand = async function (req, res, next) {
  try {
    let fullname=req.session.name
    aboveonethousand = await adminAddProduct.find({ $and: [{ productprice: { $gt: 1000, $lt: 2000 } }, { status: { $nin: false } }] })
  pushdata = aboveonethousand
  console.log(pushdata,);
  res.render('user-shop', { pushdata, categories,fullname })
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const userGetFilterabovetwothousand = async function (req, res, next) {
  try {
    
    let fullname=req.session.name
    abovetwothousand = await adminAddProduct.find({ $and: [{ productprice: { $gt: 2000 } }, { status: { $nin: false } }] })
    pushdata = abovetwothousand
    console.log(pushdata,);
    res.render('user-shop', { pushdata, categories,fullname })
  } catch (error) {
    console.log(error);
    next()
  }
 
}
const userGetWishList = function (req, res, next) {
   try {
    wishid = req.params.id
  console.log(wishid);
  req.session.wishid = wishid      //wish id in session//
  res.redirect('/wish-list')
   } catch (error) {
    console.log(error);
    next()
   }
  
}

const userGetWishListWithoutId = async function (req, res, next) {
  try {
    user = req.session.user
  wishid = req.session.wishid
  wishproduct = await adminAddProduct.findOne({ _id: new ObjectId(wishid) })
 
  if (wishproduct) {
    let bodyid = wishproduct.productid
    console.log(bodyid);
    console.log(wishproduct);

    let wishExist = await userwishlistdata.findOne({ user: user })
    if (wishExist == null) {
      let userwish = {
        user: user,
        wishlistproduct: { productId: bodyid }
      }
      console.log(userwish);
      await userwishlistdata.insertMany([userwish])
    } else {
   
      console.log(bodyid);

      // let aa=await userwishlistdata.findOne({user:user,wishlistproduct:{$elemMatch:{productId:bodyid}}})
      let wishlistcheck = await userwishlistdata.find({ $and: [{ user: user }, { "wishlistproduct.productId": bodyid }] })
     
      console.log(wishlistcheck)
      if (wishlistcheck.length == 0) {
        await userwishlistdata.updateOne({ user: user }, { $push: { wishlistproduct: { productId: bodyid } } })
      } else {
      }
    }
  }
  res.json({ status: true })
  //  .redirect('/user-shop')
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const UserGetWishListShow = async function (req, res, next) {
  try {
    user = req.session.user
    let fullname=req.session.name
    let displaywishlist = await userwishlistdata.aggregate([{ $match: { user: user } }, { $unwind: "$wishlistproduct" },
    { $project: { productId: "$wishlistproduct.productId" } },
    {
      $lookup: {
        from: 'adminaddproducts',
        localField: 'productId',
        foreignField: 'productid',
        as: 'wishlistproduct'
      }
    },
    {
      $project: { productid: '$wishlistproduct.productid', adminaddproduct: { $arrayElemAt: ['$wishlistproduct', 0] } }
    }
    ])
  
    console.log(displaywishlist);
    res.render('wish-List', { displaywishlist,fullname })
  
  } catch (error) {
    console.log(error);
    next()
  }
 
}
const userGetDeleteWishlist = async function (req, res, next) {
  try {
    user = req.session.user
  wishlistdeleteid = req.params.productid

  console.log(wishlistdeleteid);
  await userwishlistdata.updateOne(
    { user: user },
    { $pull: { wishlistproduct: { productId: wishlistdeleteid } } }
  );

  res.json({ status: true })
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const userAddToWallet = async function (req, res, next) {
  try {
    user = req.session.user
  addwallet = req.params.grandtotal
  let objj = req.params.id
  console.log(addwallet);
   await userdata.updateOne({username:user},{$inc:{wallet:addwallet}})
  console.log("ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
  await userorder.updateOne({ _id: new ObjectId(objj) }, { $rename: { 'returnstatus': 'returned' } })
  console.log(objj);
  await userorder.updateOne({ _id: new ObjectId(objj) }, { $set: { status: 'return' } })
  await userorder.updateOne({ _id: new ObjectId(objj) }, { $set: { admin: 'return' } })


  console.log("kkkkkkkkkkkkkkkkkkkkkk");

  //  await userorder.updateOne({user:user},{$set:{'product.returnstatus':false}})
  // let hh=await userorder.updateOne({$and:[{user:user},{produt:{$in:[returnstatus]}}]},{$set:{returnstatus:false}})


  res.redirect('/order-list') 
  } catch (error) {
    console.log(error);
    next()
  }
  
}

//-----------------------------------* POST USER METHOD . *--------------------------------------//
const userPostSignup = async function (req, res, next) {
  try {
    let data = {
      fullname: req.body.fullname,
      username: req.body.username,
      useremail: req.body.useremail,
      password: req.body.password,
      status: true,
      wallet: 0
    }
  
    let indatabase = await userdata.findOne({ username: data.username })
    let emailcheck = await userdata.findOne({ useremail: data.useremail })
    if (indatabase == null && emailcheck == null) {
      data.password = await bcrypt.hash(data.password, 10)
  
      userdata.insertMany([data])
      req.session.user = data.username
      req.session.name = data.fullname
      res.redirect('/')
    } else {
      req.session.errormassege = "Account Already Exist Plese Login"
      res.redirect('/user-signup')
    }
  } catch (error) {
    console.log(error);
    next()
  }
  
}

/*  POST   USER LOGIN. */
const userPostLogin = async function (req, res, next) {

  try {
    let userlogindata = {
      username: req.body.username,
      password: req.body.password
    }
    const loginvalidator = await userdata.findOne({ username: userlogindata.username })
    if (loginvalidator == null) {
      req.session.loginerr = "Invalid Username"
      res.redirect('/user-login')
    } else {
      if (loginvalidator.status == true) {
  
        const passwordCheck = await bcrypt.compare(userlogindata.password, loginvalidator.password)
        if (passwordCheck == true) {
          req.session.user = userlogindata.username
          req.session.name = loginvalidator.fullname
  
          res.redirect('/')
        } else {
          req.session.loginerr = "Invalid Password"
          res.redirect('/user-login')
        }
      } else {
        req.session.loginerr = "Your Account Is Blocked"
        res.redirect('/user-login')
        
      }
    }
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const userPostOtpLogin = async function (req, res, next) {
  try {
    passemail=req.body.useremail
    console.log("llllllllllllllllllllllllllll");
    if(passemail!=""){
      console.log(passemail);
    let checkmail = await userdata.findOne({ useremail:passemail })
    let OtpCode = Math.floor(100000 + Math.random() * 900000)
    otp = OtpCode
    otpEmail = checkmail.useremail
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "fammsstore11@gmail.com",
        pass: "paiteegvfdjqecwk"
      }
    })
    let docs = {
      from: "fammsstore11@gmail.com",
      to: otpEmail,
      subject: "Famms Varification",
      text: OtpCode + " Famms Verfication Code,Do not share with others"
    }
    mailTransporter.sendMail(docs, (err) => {
      if (err) {
        console.log(err)
      }
    })
    res.redirect('/user-otp')
    }else{
      req.session.erremail="Invalid Email"
      res.redirect('/user-otpemail')
    }
    
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const userPostOtp = async function (req, res, next) {
  try {
    if (req.body.otp == otp&&req.body.otp!="") {
      let loger = await userdata.find({ useremail: otpEmail })
      req.session.user = loger[0].username
      req.session.name = loger[0].fullname
      console.log(loger);
      res.redirect('/')
    } else {
      otplogerr="Invalid OTP"
      req.session.otplogerr=otplogerr
      res.redirect('/user-otp')
    }
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const userPostChageEmail = async function (req, res, next) {
  try {
    let chageEmail=req.body.useremail
  if(chageEmail==''){
    req.session.changeemail="Invalid Email"
    res.redirect('/changepassemail')
    
  }else{
  checkmailchange = await userdata.findOne({ useremail:chageEmail})
  console.log(checkmailchange.password)
  let OtpCode = Math.floor(100000 + Math.random() * 900000)
  changeotp = OtpCode
  changeotpEmail = checkmailchange.useremail
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "fammsstore11@gmail.com",
      pass: "paiteegvfdjqecwk"
    }
  })
  let docs = {
    from: "fammsstore11@gmail.com",
    to: changeotpEmail,
    subject: "Famms Varification",
    text: OtpCode + " Famms Verfication Code,Do not share with others"
  }
  mailTransporter.sendMail(docs, (err) => {
    if (err) {
      console.log(err)
    }
  })

  res.redirect('/changeotpv')
}

  } catch (error) {
    console.log(error);
    next()
  }
  
}

const UserChangeOtpVer = async function (req, res, next) {
  try {
    if (req.body.otp == changeotp&&req.body.otp!="") {
      res.redirect('/changepassword')
    } else {
      req.session.changeotperr="Invalid OTP"
      res.redirect('/changeotpv')
    }
  } catch (error) {
    console.log(error);
    next()
  }
}

const UserPostPassChanegeVer = async function (req, res, next) {
  try {
    const newpasswords = {
      password: req.body.password,
      confirm_password: req.body.confirm_password
    }
    if(newpasswords.password!=""&&newpasswords.confirm_password!=""){
    if (newpasswords.password != newpasswords.confirm_password) {
      res.redirect('/changepassword')
      passerr = "Password Not Matching"
    } else {
      let changepassword = await bcrypt.hash(newpasswords.password, 10)
      let passupdate = await userdata.updateOne({ password: checkmailchange.password }, { $set: { password: changepassword } })
      if (passupdate) {
        let changing = await userdata.find({ useremail: changeotpEmail })
        req.session.user = changing[0].username
        req.session.name = changing[0].fullname
        res.redirect('/')
      } else {
        res.redirect('/changepassword')
      }
    }
  }else{
    res.redirect('/changepassword')
  }
  } catch (error) {
    console.log(error);
    next()
  }
  
}

const UserPostShopCart = async function (req, res, next) {
  try {
    quantity = req.body.quantity
  proId = req.params.id
  req.session.productidd=proId 
  
  userId = req.session.user
  proObj = {
    items: proId,
    quantity: 1
  }

  console.log(proObj);
  let userCart = await usercartdata.findOne({ user: userId })
  console.log(userCart);
  if (userCart == null) {
    let cartObj = {
      user: userId,
      products: [proObj]
    }
    usercartdata.insertMany([cartObj])
  } else {
    let proExist = await usercartdata.find({ $and: [{ user: userId }, { "products.items": proId }] })
    if (proExist != null && proExist != "") {
    } else {
      await usercartdata.updateOne({ user: userId }, { $push: { products: proObj } })
    }
  }
  res.redirect('/user-shopcart')
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const userPostUpdateQuantity = async function (req, res, next) {
  try {
    user = req.session.user
    cartitems = req.body
    
    cartitems.count = parseInt(cartitems.count)
    let cartData = await usercartdata.findOneAndUpdate({ $and: [{ user: user }, { 'products.items': cartitems.product }] },
      { $inc: { 'products.$.quantity': cartitems.count } })
    let products = cartData.products
    let productObjs = []
    for (i = 0; i < products.length; i++) {
      let product = products[i]
      let dbProduct = await adminAddProduct.findOne({ productid: product.items })
      let quantity
      
      if (product.items == cartitems.product) {
        quantity = product.quantity + cartitems.count
        quant = quantity
      }
  
      else {
        quantity = product.quantity
      }
      console.log("llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");
  
      stock = dbProduct.stock
     
      
      
      let productObj = {
        productId: product.items,
        quantity: quantity,
        price: dbProduct.productprice,
        finalPrice: quantity * dbProduct.productprice
  
  
      }
      let ID=productObj.productId
     console.log("productIIIDDDDDDDD",ID);
     console.log(stock);
     console.log(quant);
     req.session.quant= parseInt(quant)
     req.session.productId=ID
      productObjs.push(productObj)
      
    }
    if (quant <= stock) {
      carterr = null
    } else {
      carterr = "OUT OF STOCK"
    }
  
    res.json(
      {
        status: true,
        products: productObjs,
        stock: carterr
      }
    )
    
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
  
  } catch (error) {
    console.log(error);
    next()
  }
 
}

const UserPostAddress = async function (req, res, next) {
  try {
    user = req.session.user
  // if (user) {
    let usersdatas
    userId = user
    usersdatas = {}
    usersdatas.address = req.body
    usersdatas.user = userId
    let exist = await useraddress.findOne({ user: userId })
    if (exist == null) {
      await useraddress.insertMany([usersdatas])

      res.redirect('/')
    } else {
      let body = req.body

      await useraddress.updateOne({ user: user }, { $push: { address: body } })
      res.redirect('/')
    }
  // } else {
  //   res.redirect('/')
  // }
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const UserProfilePassChange = async function (req, res, next) {
  try {
    user = req.session.user
  paswrd = req.body
  let findpass = await userdata.findOne({ username: user })

  if (findpass == null) {
    res.redirect('/user-change')
    passerrmsg = "Current Password Is Wrong"
  } else {
    const passwordCheck = await bcrypt.compare(paswrd.password, findpass.password)
    if (passwordCheck == true) {
      console.log(findpass.password);
      newpassword = await bcrypt.hash(paswrd.newpassword, 10)
      await userdata.updateOne({ username: user }, { $set: { password: newpassword } })
      res.redirect('/user-profile')

    } else {
      res.redirect('/user-change')
      passerrmsg = "Current Password Is Wrong"
    }
  }
  } catch (error) {
    console.log(error);
    next()
  }
  
}

const userPostOrderListPass = async function (req, res, next) {
try {
  let cartAllProducts = await usercartdata.aggregate([
    { $match: { user: user } }, { $unwind: '$products' },
    { $project: { items: "$products.items", quantity: "$products.quantity" } },
    {
      $lookup: {
        from: 'adminaddproducts',
        localField: 'items',
        foreignField: 'productid',
        as: 'products'
      }
    },
    { $project: { items: 1, quantity: 1, products: { $arrayElemAt: ['$products', 0] } } }
  ])
  for (var i = 0; i < cartAllProducts.length; i++) {
    totalprice = cartAllProducts[i].quantity * cartAllProducts[i].products.productprice
    cartAllProducts[i].totalprice = totalprice
  }
  let grandtotal = 0;
  for (var i = 0; i < cartAllProducts.length; i++) {
    grandtotal += cartAllProducts[i].totalprice
  }
  let subgrandtotal = grandtotal
  grandtotal += 84

  coupensid = req.session.coupen
  let status = req.body.paymentmethod === "COD" ? "Placed" : "Pending";
  let delivery = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    landmark: req.body.landmark,
    town: req.body.town,
    state: req.body.state,
    pincode: req.body.pincode,
    phonenumber: req.body.phonenumber,
    email: req.body.email
  }
  payment = req.body.paymentmethod
  grandtotal = req.body.grandtotal
  returnstatus = false
  user = req.session.user
  ordereddate = new Date().toLocaleString();
  let deldt = new Date()
  deliverydate = new Date(deldt.setDate(deldt.getDate() + 7))
  deliverydate = deliverydate.toLocaleString()
  status = status
  let OrderId = uuidv4()
  returnstatus = true

  if (req.body.paymentmethod === 'OnlinePayment') {
    await userdata.updateOne({ username: req.session.user }, { $addToSet: { usedcoupen: coupensid } })
    orderss = {
      deliveryaddress: delivery,
      paymentmethod: payment,
      grandtotal: grandtotal,
      ordereduser: user,
      product: cartAllProducts,
      ordereddate: ordereddate,
      status: status,
      returnstatus: returnstatus

    }
  req.session.orderss=orderss

    var options = {
      amount: grandtotal * 100,
      currency: "INR",
      receipt: "" + OrderId
    };
    console.log(OrderId);
    instance.orders.create(options, function (err, order) {
      if (err) {
        console.log(err)
      } else {
        coupensid = req.session.coupen
        res.json({ status: true, order: order })
      }
    })
  } else if (req.body.paymentmethod === 'COD') {
    await userorder.insertMany([{ deliveryaddress: delivery, paymentmethod: payment, grandtotal: grandtotal, ordereduser: user, product: cartAllProducts, ordereddate: ordereddate, deliverydate: deliverydate, status: status, returnstatus: true }])

    res.json({ status: false })
   
    await usercartdata.deleteOne({ user: req.session.user })
  } else {
    await userorder.insertMany([{ deliveryaddress: delivery, paymentmethod: payment, grandtotal: grandtotal, ordereduser: user, product: cartAllProducts, ordereddate: ordereddate, deliverydate: deliverydate, status: status, returnstatus: true }])
    
    res.json({ status: false })
    
    await usercartdata.deleteOne({ user: req.session.user })
    price = req.session.walletprice
    await userdata.updateOne({ username: user }, { $set: { wallet: price } })
  }
} catch (error) {
  console.log(error);
  next()
}
  

}
const userGetverifypayment = async function (req, res, next) {
  try {
let orderss=req.session.orderss
    user = req.session.user
    let raz = req.body
    console.log(raz);
    const crypto = require('crypto');
    let hmac = crypto.createHmac('sha256', 'HaLf5rSz5VtODRm1r6BEgvdB')
    hmac.update(raz['payment[razorpay_order_id]'] + '|' + raz['payment[razorpay_payment_id]']);
    hmac = hmac.digest('hex')
    console.log(hmac);
    if (hmac == raz['payment[razorpay_signature]']) {
      order = orderss
      console.log(order);
      order.ordereddate = new Date()
      order.ordereddate = order.ordereddate.toLocaleString()
      let dt = new Date()
      order.deliverydate = new Date(dt.setDate(dt.getDate() + 7))
      order.deliverydate = order.deliverydate.toLocaleString()
      order.product[0].products.paymentid = uuidv4()

      for (i = 0; i < order.product[0].products.length; i++) {
        order.product[0].products[i].paymentid = req.body['payment[razorpay_payment_id]']
      }
      await userorder.insertMany([order])
      await usercartdata.deleteOne({ user: req.session.user })
      req.session.user.order = null;
      res.json({ PaymentSuccess: true })

    }
  } catch (error) {
    console.log(error);
    next()
  }
  
}
const UserTryCoupen = async function (req, res, next) {
  try {
    const coupenId = req.body.coupencode
  
  let usedcoupecheck = await userdata.findOne({ username: req.session.user, usedcoupen: { $in: [coupenId] } })

  if (usedcoupecheck == null) {
    let coupencheck = await admincoupendata.findOne({ coupencode: coupenId })
    
    if (coupencheck) {
      const date = new Date().toLocaleString()
     
      if (date > coupencheck.expiredate && coupencheck.status == true) {
       
        req.session.coupen = coupenId
      } else {
        
        coupenerr = "Invalid  Coupencode"
      }
    } else {
      coupenerr = "Invalid Coupencode"
    }
  } else { coupenerr = "This Coupen Is Already Used" }
  res.redirect('/user-shopcart')
  } catch (error) {
    console.log(error);
    next()
  }
  
}

const UserPostSearch = async function (req, res, next) {
  try {
    let payload = req.body.payload.trim();
  
  let search = await adminaddproduct.find({ productname: { $regex: new RegExp('^' + payload + '.*', 'i') } });
  //search=search.slice(0,10);
  console.log(search);
  
  res.send({ payload: search });
  } catch (error) {
    console.log(error);
    next()
  }
  
  // try {
  //   let Payload = req.body.Payload;
  // console.log(Payload);
  // let search = await adminaddproduct.find({ productname: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
  // search=search.slice(0,10);
  // console.log(search); 
  // res.send({ Payload: search });
  // } catch (error) {
  //   console.log(error);
  //   next()
  // }
  
}
module.exports = {
  userGetHome, userGetSignup, userGetLogin, userGetOtp, userChangePassword, userGetCpange, userPostOrderListPass,
  userPostSignup, userPostLogin, userPostOtpLogin, userGetOtpVerification, userPostOtp, UserProfilePassChange,
  UserGetSingleProduct, UserGetSingleProductId, userGetShopCart, UserGetCheckOut, UserGetAddressPass, userGetverifypayment,
  UserGetEmailChangePass, UserChangeOtp, userPostChageEmail, UserChangeOtpVer, UserPostPassChanegeVer, UserTryCoupen,
  UserGetUserShopProduct, UsergetCategoryPass, UserGetAllProduct, UserGetUserProfile, UserGetUserLogOut, UserPostSearch,
  UserPostShopCart, userPostUpdateQuantity, UserGerDeleteCart, UserPostAddress, userGetOrderStatus, userGetEditAddress,
  UserOrderList, userOrderedProductData, UserOrderProductwithoutId, userGetFilterBelone, userGetFilterabovefive, userGetDeleteWishlist,
  userGetFilterabovethousand, userGetFilterabovetwothousand, userGetWishList, userGetWishListWithoutId, UserGetWishListShow,
  userAddToWallet,
}

