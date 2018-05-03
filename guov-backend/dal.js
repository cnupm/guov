const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
mongoose.connect("mongodb://localhost:27017/guov");
var db = mongoose.connection;
autoIncrement.initialize(mongoose.connection);

db.on('error', function (err) {
    console.error('connection error: ', err.message);
});

db.once('open', function callback() {
    console.info("Connected to DB");
});

var Schema = mongoose.Schema;

module.exports = {mongoose, autoIncrement};