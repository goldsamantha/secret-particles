var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
var particleSchema = new Schema({
  _id: String,
  msg: String,
  openedAt: Number
});
var Particle = mongoose.model('Particle', particleSchema);
var util = require('../util');

mongoose.connect('mongodb://localhost:45000/particlesdb');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('opened connection to db');
});

// var uuid = require('uuid');
// var db = {};


function getNextId(cb) {
  return Particle.count(cb);
}

exports.save = function(message, cb) {
  getNextId(function(err, count) {
    if (err) return cb(err);
    var particle = new Particle({
      _id: util.toBase62(count + 1),
      msg: message,
      openedAt: 0
    });

    particle.save(cb);
  });
};

function getById(id, cb) {
  Particle.find({
    _id: id
  }, function(err, particleArray) {
    if (err) return cb(err);
    if (!particleArray.length) return cb(new Error('Scattered thought ' + id + ' not found :('));
    return cb(null, particleArray[0]);
  });
}

exports.getById = getById;
// exports.getById = function(id){
//   if (id in db) return db[id];
//   else throw new Error("Entry Not Found");
// }
//

exports.setOpenedAt = function(id, date, cb) {
  getById(id, function(err, particle) {
    if (err) return cb(err);
    if (!particle.openedAt) {
      // particle.openedAt = +new Date;
      console.log('Updating openedAt', id, date);
      return Particle.update({
        _id: particle._id
      }, {
        openedAt: date
      }, function(err) {
        if (err) return cb(err);
        return cb(null, particle);
      });
    }
    return cb(null, particle);
  });
};

// exports.setOpenedAt = function(id, date){
//   if (!db[id].openedAt){
//     db[id].openedAt = date;
//   }
//   console.log(db);
// }


exports.getMessage = function(id, cb) {
  getById(id, function(err, particle) {
    if (err) return cb(err);
    return cb(null, particle.msg);
  });
};

// exports.getMessage = function(id){
//   if (id in db) return db[id].msg;
//   else throw new Error("Entry Not Found");
// }


// MIGHT NOT NEED
exports.getOpenedAt = function(id, cb) {
  getById(id, function(err, particle) {
    if (err) return cb(err);
    return cb(null, particle.openedAt);
  });
};

// exports.getOpenedAt= function(id){
//   return db[id].openedAt;
// }
