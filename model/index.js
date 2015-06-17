var uuid = require('uuid');
var db = {};


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:45000/particles');

// var Schema = mongoose.Schema,
//   ObjectId = Schema.ObjectId;

// var particlesDB = new Schema({
//   msg: String,
//   openedAt: Date
// });

exports.save = function(message){
  var idnum = uuid.v4();
  db[idnum] = {
    msg: message,
    openedAt: 0
  };
  console.log(db);
  return idnum;
}

exports.getById = function(id){
  if (id in db) return db[id];
  else throw new Error("Entry Not Found");
}

exports.setOpenedAt = function(id, date){
  if (!db[id].openedAt){
    db[id].openedAt = date;
  }
  console.log(db);
}


//MIGHT NOT NEED
exports.getOpenedAt= function(id){
  return db[id].openedAt;
}
