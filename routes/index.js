var express = require('express');
var Period = require('../model/userModel');
var router = express.Router();



router.post('/addAttedData', function(req, res, next) {
  let periodData = new Period(req.body);

  periodData.save((err, savedData)=>{
    if(err){
      res.json({
        success: false,
        msg: "Sorry, Something Wrong. Try Again.",
        data: []
      });
    }else{
      res.json({
        success: true,
        msg: "Code Generated Successfully.",
        data: [savedData]
      });
    }
  });  
});






router.post('/getAttedData', function(req, res, next) {

  // console.log('from student', req.body);

  let searchData = {
    org_id: req.body.org_id,
    period_id: req.body.period_id,
    date: req.body.date,
    active: true
  }

  Period.findOne(searchData, (err, foundData)=>{
    if(err){
      res.json({
        success: false,
        msg: "Sorry, Something Wrong. Try Again.",
        data: []
      });
    }else if(!foundData){
      res.json({
        success: false,
        msg: "Period Not Found.",
        data: []
      });
    }else{
      res.json({
        success: true,
        msg: "",
        data: [foundData]
      });
    }
  });  
});








router.post('/deactivateAtted', function(req, res, next) {

  // console.log('from student', req.body);

  Period.findByIdAndUpdate(req.body.id, {active: false}, (err, updateData)=>{
    if(err){
      res.json({
        success: false,
        msg: "ERROR : Sorry, Something Wrong. Try Again.",
        data: []
      });
    }else if(!updateData){
      res.json({
        success: false,
        msg: "ERROR : Deactivation Not Success.",
        data: []
      });
    }else{
      res.json({
        success: true,
        msg: "SUCCESS : Period Deactivation Successful.",
        data: [updateData]
      });
    }
  });  
});







router.post('/addStdListOnPeriod', function(req, res, next) {

  Period.findOneAndUpdate(req.body.id, {std_list: req.body.std_list}, (err, updateData)=>{
    if(err){
      res.json({
        success: false,
        msg: "ERROR : Sorry, Something Wrong. Try Again.",
        data: []
      });
    }else if(!updateData){
      res.json({
        success: false,
        msg: "ERROR : Attendence Not Success.",
        data: []
      });
    }else{
      res.json({
        success: true,
        msg: "SUCCESS : Attendence Successful.",
        data: [updateData]
      });
    }
  });  
});








router.get('/oauth2callback', function(req, res, next) {
    console.log('from the redirect uri...');      
});









router.post('/getStudentAttnPercent', function(req, res, next) {
  // console.log('from the redirect uri...');  
  let searchData = {
    org_id: req.body.org_id,
    department_id: req.body.dept_id,
    active: false
  }

  Period.find(searchData, (err, data)=>{
    if(err){
      res.json({
        success: false,
        msg: "Sorry, Something Wrong. Try Again.",
        data: []
      });
    }else{
      res.json({
        success: true,
        msg: "Data fetch successfully.",
        data: data,
      });
    }
  });
});







module.exports = router;