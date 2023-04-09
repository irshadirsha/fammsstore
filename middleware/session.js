var express = require('express'); 

const sessioncheck=(req,res,next)=>{
  if(req.session.user==null){  
    res.redirect('/user-login')
  }else{
    next()
  }
}


const adminSession=(req,res,next)=>{
  if( req.session.admin == null){
    res.redirect('/admin-login')
  }else{
    next()
  }
}


module.exports={sessioncheck:sessioncheck,adminSession:adminSession}