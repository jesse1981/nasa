/*jslint node: true */
"use strict";

var fs = require('fs');
var https = require('https');
var request = require('request');
var cheerio = require('cheerio');

var x_nab_host = "hackathon.api.extnp.nab.com.au";
var x_nab_key = "0c12ce1a-f5a5-4933-b5aa-c27e14c757d7";
var x_nab_ver = "/v2/";
var x_auth_ver = "1";

// by default we don't follow redirects
request = request.defaults({
  followRedirect: false
});

module.exports = function(logFactory, config) {

    var log = logFactory.get("customerService");

    var _self = this;
    var customerData = {};
    var err = null;

    this.customer = function(loginToken,cb) {

        log.info("customer: start");
        var buffer = "";
        
        // An object of options to indicate where to post to
        var post_options = {
            host: x_nab_host,
            port: '80',
            path: x_nab_ver + "cusotmer/profile" + "?v=" + x_auth_ver,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-nab-key': x_nab_key,
                'Authorization': loginToken
            }
        };
        
        // Set up the request
        var post_req = https.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                log.info('Response: ' + chunk);
                buffer += chunk;
            });
            res.on('end',function(chunk) {
                var data = JSON.parse(buffer);
                _self.customerData = data;
                return true;
            });
        });
        
        // post the data
        post_req.write(JSON.stringify(post_data));
        post_req.end();
    };
}