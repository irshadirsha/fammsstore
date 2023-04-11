var express = require('express'); 

const sessioncheck=(req,res,next)=>{
  if(req.session.user==null){  
    res.redirect('/user-login')
  }else{
    next()
  }
}

const sessionNotUserLogin=(req,res,next)=>{
  if(req.session.user){
      res.redirect('/')
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

const sessionNotAdminLogin=(req,res,next)=>{
  if(req.session.admin){
      res.redirect('/admin-dashbord')
  }else{
      next()
  }
}


module.exports={sessioncheck:sessioncheck,adminSession:adminSession,
               sessionNotAdminLogin:sessionNotAdminLogin,sessionNotUserLogin:sessionNotUserLogin}