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

    var log = logFactory.get("loginService");

    var _self = this;
    var _userData = {};
    var err = null;

    this.login = function(user,pass,cb) {

        log.info("doLogin: start");
        var buffer = "";
        var post_data = {
            "loginRequest": {
                "brand": "nab",
                "lob": "nab",
                "credentials": {
                    "apiStructType": "usernamePassword",
                    "usernamePassword": {
                        "username": user,
                        "password": pass
                    }
                }
            }
        }
        
        // An object of options to indicate where to post to
        var post_options = {
            host: x_nab_host,
            port: '80',
            path: x_nab_ver + "auth" + "?v=" + x_auth_ver,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
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
                _self.userData = data;
                return true;
            });
        });
        
        // post the data
        post_req.write(JSON.stringify(post_data));
        post_req.end();
    };
}