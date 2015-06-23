var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', name: "Samantha" });
});

router.get('/save', function(req, res, next){
  var idnum = model.save(req.query.msg, function(err, particle) {
    if (err) next(err);
    res.render('create', {id: particle._id});
  });
});

//get everything after colon
router.get('/:id', function(req, res, next){
  var id = req.params.id;
  model.getById(id, function(err, particle) {
    if (err) next(err);
    console.log(particle);
    res.render('particles', {title: 'PARTICLES', data: particle});
  });
});

module.exports = router;
