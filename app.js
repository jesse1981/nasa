/*jslint node: true */
"use strict";

var conf = require('./config.js');

var SimpleLog = require('./util/simpleLog.js');
var db = require('./service/db.js');
var logFactory = new SimpleLog(conf.logLevel);

var util = require('util'),
    express = require('express'),
    expressValidator = require('express-validator'),
    async = require('async'),
    bodyParser = require('body-parser'),
    _ = require('lodash'),
    app = express();

var log = logFactory.get("app");
var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

/*
var merchantFile = './data/merchant_factor.csv';
var merchantData = {};
*/

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(expressValidator());

app.get('/', function(req, res) {
    //db.bar();
    var query = "SELECT * FROM test";
    db.query(query,function(result){
        res.setHeader('content-type',' text/json');
        res.send(JSON.stringify(result));
    });
});
app.post('/data', function(req, res) {
    console.log(req.body);
    res.header('Access-Control-Allow-Origin','*');
    
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);
    
    // Website you wish to allow to connect
    res.header('content-type',' text/json');
    var test = {
        name: "jesse",
        age: 35
    };
    res.send(JSON.stringify(test));
});

//conf.http.port  = 80; //process.env.PORT;
log.info("Listening on port " + conf.http.port);

app.listen(conf.http.port);
