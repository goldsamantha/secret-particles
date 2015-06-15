var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', name: "Samantha" });
});

router.get('/save', function(req, res){
  var idnum = model.save(req.query.msg);

  res.redirect('/?success=true&id='+idnum);
});

//get everything after colon
router.get('/:id', function(req, res, next){
  var id = req.params.id;
  try {
    res.render('particles', { title: 'PARTICLES' , data: model.getById(id)});
  } catch(err){
    next(err);
  }
});

module.exports = router;
