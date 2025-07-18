const errorPage=(req,res,next)=>{
  res.status(404).render('404',{pageTitle:"Page Not Found", currentPage:"404",isLoggedIn:req.isLoggedIn,user:req.session.user});
}
exports.errorPage=errorPage;