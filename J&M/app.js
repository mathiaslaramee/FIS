"use strict";

var express = require('express');        // call express
var app = express();                     // define our app using express
var bodyParser = require('body-parser');
var morgan = require('morgan')
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var messages = [{message: "Her er en tekstbesked"}, {message: "Sandy er dum", id: "666"}];
var request = require('request');

// INITIALIZATION
// =============================================================================
app.set('port', (process.env.PORT || 8080)); // Set the port

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var mongoose = require('mongoose');
// We pick the default Promise implementation

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://bruger:andersand@ds155087.mlab.com:55087/brugere');

var User = require('./public/javascripts/User');
// ROUTES FOR OUR APP
// =============================================================================
var router = express.Router();
// catch 404 and forward to error handler


app.post('/newUser/:id', function(req, res) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        ssNumber: req.body.ssNumber,
        address: req.body.address,
        postalCode: req.body.postal,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        employeeNumber: req.params.id + "",
        password: generatePassword(),
        team: req.body.team,
        shifts: [],
        applications: []
    });
    user.save(function(err) {
        if(err)
        {
            res.status(500);
            res.send(err9);
        } else
        {
            res.json(user);
        }
    })
});

app.get('/applications/:id', function(req, res) {
    var user;
    User.find({"employeeNumber" : req.params.id}, function(err, users) {
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(users);
            if(users.length == 1)
            {
                user = users[0];
                user.applications.push({"date":"12.maj", "type":"14-6 fri", "team":"3"});
                res.render('applications',{user: user.firstName, applications: user.applications});
            }
        }


    });

});

app.listen(app.get('port'), function() {
    console.log("lytter på dig");
});


module.exports = app;


function generatePassword() {
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}