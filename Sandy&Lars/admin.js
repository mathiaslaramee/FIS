/**
 * Created by Neels1 on 21/11/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var admin = new Schema({
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

module.exports = mongoose.model('Admin', admin);
