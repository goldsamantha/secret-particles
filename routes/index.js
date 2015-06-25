var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'PARTICLES',
    name: 'Samantha'
  });
});

router.get('/save', function(req, res, next) {
  model.save(req.query.msg, function(err, particle) {
    if (err) return next(err);
    res.render('create', {
      data: particle
    });
  });
});

// get everything after colon
router.get('/show/:id', function(req, res, next) {
  var id = req.params.id;

  model.getById(id, function(err, particle) {
    if (err) return next(err);
    res.render('particles', {
      title: 'PARTICLES',
      data: particle
    });
  });
});

module.exports = router;
