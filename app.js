/*jslint node: true */
"use strict";

var conf = require('./config.js');

var SimpleLog = require('./util/simpleLog.js');
//var db = require('./service/db.js');
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
    /*
    var query = "SELECT * FROM DATA";
    db.query(query,function(result){
        res.setHeader('content-type',' text/json');
        res.send(JSON.stringify(result));
    });
    */
});
app.post('/data', function(req, res) {
    console.log(req.body);
    var data = [
        [
            "Input 0",3495.122859,-805.9697776,-1435.109138,-197.709456,-197.709456,-82.2347708,3.560796237,3.560796237,3.560796237
        ],
        [
            "Input 1",3467.571774,-805.969768,-1435.109139,-197.7094558,-197.7094558,-82.23477081,3.56079604,3.56079604,3.56079604
        ],
        [
            "Input 2",3445.011511,-805.9699619,-1435.109212,-197.7094401,-197.7094401,-82.23477138,3.560792446,3.560792446,3.560792446
        ],
        [
            "Input 3",3404.086169,-805.9732178,-1435.114799,-197.7082405,-197.7082405,-82.23481546,3.560725463,3.560725463,3.560725463
        ],
        [
            "Input 4",3329.933573,-806.0322115,-1435.516312,-197.6250654,-197.6250654,-82.23798309,3.559511817,3.559511817,3.559511817
        ],
        [
            "Input 5",3195.734867,-807.0718454,-1462.686943,-194.5393363,-194.5393363,-82.45233867,3.538123974,3.538123974,3.538123974
        ]
    ];
    
    console.log(data);
    var result = 0;
    var input = req.body;
    
    /*
    db.query("SELECT * FROM main",function(rows) {
        
    });
    */
    
    var cnt = 0;
    for (var a in input.value) {
        console.log("x = "+(cnt+1)+", y = "+parseInt(input.value[a])+" = "+data[parseInt(input.value[a])][(cnt+1)]);
        result += data[parseInt(input.value[a])][(cnt+1)];
        cnt++;
    }
    console.log(conf.seaBaseLevel);
    result += conf.seaBaseLevel;
    console.log(result)
   
    res.header('Access-Control-Allow-Origin','http://localhost:8000');
    
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);
    
    // prepare result
    res.header('content-type','text/plain');
    res.header('content-length',result.toString().length);
    res.status(200);
    res.send(result.toString());
});

//conf.http.port  = 80; //process.env.PORT;
log.info("Listening on port " + conf.http.port);

app.listen(conf.http.port);
