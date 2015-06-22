var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
var particlesSchema = new Schema({
  _id: String,
  msg: String,
  openedAt: Date
});
var Particles = mongoose.model('Particles', particlesSchema);
var util = require('../util');

mongoose.connect('mongodb://localhost:45000/particlesdb');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

// var uuid = require('uuid');
// var db = {};


function getNextId(cb) {
  return Particles.count(cb);
}

exports.save = function(message){
  getNextId(function(err, count) {
    var particle = new Particle({
      _id: count,
      msg: message,
      date: new Date
    });
    particle.save(function(err, particle) {
      if (err) throw err;
      console.log('Saved particle', particle);
    });
  });
}

exports.getById = function(id, cb) {
  Particles.find({_id: id}, cb);
}

// exports.getById = function(id){
//   if (id in db) return db[id];
//   else throw new Error("Entry Not Found");
// }
//

exports.setOpenedAt = function(id, date, cb) {
  getById(id, function(err, particle) {
    if (err) cb(err);
    if (!particle.openedAt) {
      particle.openedAt = +new Date;
      return particle.save(cb);
    }
    return cb(null, particle);
  });
}

// exports.setOpenedAt = function(id, date){
//   if (!db[id].openedAt){
//     db[id].openedAt = date;
//   }
//   console.log(db);
// }


exports.getMessage = function(id, cb) {
  getById(id, function(err, particle) {
    if (err) cb(err);
    cb(null, particle.msg);
  });
}

// exports.getMessage = function(id){
//   if (id in db) return db[id].msg;
//   else throw new Error("Entry Not Found");
// }


//MIGHT NOT NEED
exports.getOpenedAt = function(id, cb) {
  getById(id, function(err, particle) {
    if (err) cb(err);
    cb(null, particle.openedAt);
  });
}

// exports.getOpenedAt= function(id){
//   return db[id].openedAt;
// }
