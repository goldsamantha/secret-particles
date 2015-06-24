var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PARTICLES', name: "Samantha" });
});

router.get('/save', function(req, res, next){
  var idnum = model.save(req.query.msg, function(err, particle) {
    if (err) return next(err);
    // res.render('create', {id: particle._id});

    res.render('create', {data: particle});
  });
});

//get everything after colon
router.get('/:id', function(req, res, next){
  var id = req.params.id;
  // console.log('dude');
  model.getById(id, function(err, particle) {
    console.log(err);
    if (err) return next(err);
    console.log(particle);
    res.render('particles', {title: 'PARTICLES', data: particle});
  });
});

module.exports = router;
