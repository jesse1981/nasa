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

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(expressValidator());

app.get('/', function(req, res) {
    var query = "SELECT * FROM DATA";
    db.query(query,function(result){
        res.setHeader('content-type',' text/json');
        res.send(JSON.stringify(result));
    });
});
app.post('/data', function(req, res) {
    console.log(req.body);
    
    db.query("SELECT * FROM DATA",function(data) {
        console.log(data);
        var result = 0;
        var input = req.body;
        
        var cnt = 0;
        for (var a in input.value) {
            console.log("x = "+(cnt+1)+", y = "+parseInt(input.value[a])+" = "+data[parseInt(input.value[a])]["Variable_"+(cnt+1)]);
            result += data[parseInt(input.value[a])]["Variable_"+(cnt+1)];
            cnt++;
        }
        console.log(conf.seaBaseLevel);
        result += conf.seaBaseLevel;
        console.log(result);

        res.header('Access-Control-Allow-Origin','http://localhost:8000');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.header('Access-Control-Allow-Credentials', true);

        // prepare result
        res.header('content-type','text/plain');
        res.header('content-length',result.toString().length);
        res.status(200);
        res.send(result.toString());
    });
});

//conf.http.port  = 80; //process.env.PORT;
log.info("Listening on port " + conf.http.port);

app.listen(conf.http.port);