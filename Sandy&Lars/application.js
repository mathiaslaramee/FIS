/**
 * Created by Neels1 on 16/11/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var application = new Schema({
    "name": String,
    "lastname": String,
    "employeeNumber": String,
    "dateDel": Date,
    "address": String,
    "by": String,
    "postalNr": String,
    "city": String,
    "team": String,
    "datoAns": {type: Date, default: Date.now()},
    "vacaDate": Date,
    "weekNr": Number,
    "trade": Boolean,
    "approved": Boolean,
    "comments": String


});

module.exports = mongoose.model('Application', application);