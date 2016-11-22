/**
 * Created by Mathias on 16-11-2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    firstName: String,
    lastName: String,
    ssNumber: String,
    address: String,
    postalCode: String,
    phoneNumber: String,
    email: String,
    employeeNumber: String,
    password: String,
    team: String,
    shifts: Array,
    applications: Array
});

module.exports = mongoose.model('User', user);