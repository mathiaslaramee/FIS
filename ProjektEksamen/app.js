"use strict";

var express = require('express');        // call express
var app = express();                     // define our app using express
var bodyParser = require('body-parser');
var morgan = require('morgan');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
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

var Application = require('./application.js');
var User = require('./user.js');
var Admin = require('./admin.js');
// ROUTES FOR OUR APP
// =============================================================================
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', {title: "fisk"});
});

router.put('/application/:id', function (req, res) {
    var application = new Application({
        name: req.body.name,
        lastName: req.body.lastname,
        employeeNumber: req.body.employeeNr,
        datoDel: req.body.datoDel,
        address: req.body.address,
        by: req.body.by,
        postalNr: req.body.postalNr,
        city: req.body.city,
        team: req.body.team,
        datoAns: req.body.datoAns,
        vacaDate: req.body.vacaDate,
        weekNr: req.body.weekNr,
        trade: req.body.trade,
        approved: req.body.approved,
        comments: req.body.comments
    });
    User.update(
        {"employeeNumber": req.params.id},
        {$push: {"applications": application}},
        {safe: true, upsert: true},
        function(err, user) {
            if(err) {
                console.log(err);
            } else {
                console.log(user);
            }
        }
    );
    application.save(function(err) {
        if(err)
        {
            res.status(500);
            res.send(err);
        } else
        {
            res.json({app: "app created"});
        }
    })

});



router.post('/newUser/:id', function(req, res) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        ssNumber: req.body.ssNumber,
        address: req.body.address,
        postalCode: req.body.postalCode,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        employeeNumber: req.params.id + "",
        password: generatePassword(),
        team: req.body.team,
        shifts: req.body.shifts,
        applications: req.body.applications
    });
    user.save(function(err) {
        if(err)
        {
            res.status(500);
            res.send(err);
        } else
        {
            res.json({user: "Bruger oprettet"});
        }
    })
});

router.post('/newAdmin/:id', function(req, res) {
    var admin = new Admin({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        ssNumber: req.body.ssNumber,
        address: req.body.address,
        postalCode: req.body.postalCode,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        employeeNumber: req.params.id + "",
        password: generatePassword(),
        team: req.body.team,
        shifts: req.body.shifts,
        applications: req.body.applications
    });
    admin.save(function(err) {
        if(err)
        {
            res.status(500);
            res.send(err);
        } else
        {
            res.json({admin: "oprettet"});
        }
    })
});

router.get('/applications/:id', function(req, res) {
    var user;
    User.find({"employeeNumber" : req.params.id}, function(err, users) {
        if(err) {
            res.send(err);
        }
        else {
            if(users.length == 1)
            {
                user = users[0];
               res.render('applications', {user: user.firstName, applications: user.applications});
            }
        }
    });
});

router.get('/application/:id', function(req, res) {
    var user;
    User.find({"employeeNumber" : req.params.id}, function(err, users) {
        if(err)
        {
            res.send(err);
        }
        else
        {
            if(users.length == 1)
            {
                user = users[0];
                res.render('application');
            }
        }
    });
});

router.get('/application/:id', function(req, res) {
    var user;
    User.find({"employeeNumber" : req.params.id}, function(err, users) {
        if(err)
        {
            res.send(err);
        }
        else
        {
            if(users.length == 1)
            {
                user = users[0];
                res.render('application');
            }
        }
    });
});


router.get('/userApplications/:id', function(req, res) {
    var admin;
    var user;
    Admin.find({"employeeNumber" : req.params.id}, function(err, admins) {
        if(err)
        {
            res.send(err);
        }
        else
        {
            if(admins.length == 1) {
                admin = admins[0];
                User.find( function(err, users) {
                    if(err) {
                        res.send(err);
                    }
                    else {
                        for(var i in users) {
                            res.render('userApplications', {user: users.firstName, applications: users.applications});
                        }
                    }
                });
            }
        }
    });
});


router.get('/findApp/:id', function(req, res) {
    res.render('findApp', {username: req.params.id});
});

router.get('/findApp/:id/:date', function(req, res) {

    Application.find({'employeeNumber':req.params.id}, function(err, apps) {
        if(err || apps.length == 0)
        {
            console.log('Ikke fundet');
            res.send({msg: 'not found'});
        } else {
            var day;
            var month;
            var year;
            var date = req.params.date.toString();
            var day = date.split('-');
            var reqMonth = day[0];
            var reqDay = day[1];
            var reqYear = day[2];

            for(var i in apps){

                if(apps[i].vacaDate != null)
                {
                    day = apps[i].vacaDate.getDate().toString();
                    month = apps[i].vacaDate.getMonth() + 1;
                    month = month.toString();
                    year = apps[i].vacaDate.getFullYear().toString();
                }

                if(reqDay == day && reqMonth == month && reqYear == year)
                {
                    console.log('found');
                    res.send(apps[i]);
                }
            }
        }
    });
});

function generatePassword() {
    var length = 8,
        charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

module.exports = app;


app.use('/', router);
// START THE SERVER
// =============================================================================
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});







