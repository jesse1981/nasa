/*jslint node: true */
"use strict";

var conf = require('./config.js');

var SimpleLog = require('./util/simpleLog.js');
var logFactory = new SimpleLog(conf.logLevel);

/*
var LoginService = require('./service/loginService.js');
var loginService = new LoginService(logFactory, conf);

var AccountService = require('./service/accountService.js');
var accountService = new AccountService(logFactory, conf);

var CustomerService = require('./service/customerService.js');
var customerService = new CustomerService(logFactory, conf);

var TransactionService = require('./service/transactionService.js');
var transactionService = new TransactionService(logFactory, conf);

var BinService = require('./service/binService.js');
var binService = new BinService(logFactory, conf);
*/

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
    
    res.send("This test works.");
    
});
app.post('/nab/test', function(req, res) {
    console.log("Connection established");
    var result = binService.calcBin("10055670","aaa111");
    
    console.log(result);
});
// Function and Algorithms

// Rel_1 = Transaction_Value / Total_expenditure  -- relativize the transaction
// Rel_2 = Rel_1 * Merchant_Factor -- give that a weight
// Rel_3 = Sum(Rel_2) -- For each unique Merchant, add all events
// Then add all those Rel_3's for each bin and multiply them by a bin factor
// Rel_4 = Sum(Rel_3) * Bin_Factor
// Final = Sum(Rel_4) -- for all bins, add them
// We should also normalize the Final, somehow.

//conf.http.port  = 80; //process.env.PORT;
log.info("Listening on port " + "80"); //conf.http.port);

app.listen(80); //conf.http.port);
