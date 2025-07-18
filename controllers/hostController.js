const Home=require('../models/homes');
const getAddHome=(req,res,next)=>{
  res.render('host/edit-home',{pageTitle:"Add Home",currentPage:"addhome",editing:false,isLoggedIn:req.isLoggedIn,user:req.session.user});
}
const postAddHome=(req,res,next)=>{
  console.log(req.body,req.body);
  const{houseName,Price,Location,Rating,PhotoUrl,Description}=req.body;
  const home=new Home({houseName,Price,Location,Rating,PhotoUrl,Description});
  home.save().then(()=>{
    console.log("home saved");
  });
  res.render('host/homeAddSuccess',{pageTitle:"Home Added Successfully",currentPage:"home",isLoggedIn:req.isLoggedIn,user:req.session.user});
}
exports.getHostHomes=(req,res,next)=>{
  Home.find().then((homes) => {
    console.log(homes);
    res.render('host/host-home', { registeredHomes: homes || [], pageTitle: 'Wellcome to AirBnb', currentPage: 'host-home', isLoggedIn: req.isLoggedIn, user: req.session.user });
  });
}
exports.getEditHome=(req,res,next)=>{
  const homeId=req.params.id;
  const editing=req.query.editing === 'true';
  console.log(homeId,editing);
  Home.findById(homeId.toString()).then((home)=>{
    if(!home){
      console.log("home not found");
      return res.redirect('/host/host-home');
    }
    else{
      console.log("home details found",home);
      res.render('host/edit-Home', {home:home, pageTitle: 'Edit Your Home', currentPage: 'host-home',editing:editing, isLoggedIn: req.isLoggedIn, user: req.session.user });
    }
  })
}
exports.postEditHome=(req,res,next)=>{
  const{_id,houseName,Price,Location,Rating,PhotoUrl,Description}=req.body;
  Home.findById(_id).then((home)=>{
    home.houseName=houseName;
    home.Price=Price;
    home.Location=Location;
    home.Rating=Rating;
    home.PhotoUrl=PhotoUrl;
    home.Description=Description;
    home.save().then(()=>{
      console.log("home updated");
    }).catch(err=>{console.log(err);});
  }).catch(err=>{console.log("Error while finding home",err);});
  res.redirect('/host/host-home');
}
exports.postDeleteHome=(req,res,next)=>{
  const homeId=req.params.id;
  console.log("came to delete home",homeId);
  Home.findByIdAndDelete(homeId).then((result)=>{
    res.redirect('/host/host-home');
  }).catch(err=>{console.log("Error while deleting home",err);});
}
exports.getAddHome=getAddHome;
exports.postAddHome=postAddHome;