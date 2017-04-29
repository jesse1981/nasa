var conf    = require('../config.js');
var mysql   = require('mysql');

module.exports = function(logFactory, config) {
    var connection = mysql.createConnection({
        host     : conf.database.host,
        user     : conf.database.user,
        password : conf.database.password,
        database : conf.database.database
    });

    connection.connect();
    this.query = function(sql) {
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            return results;
        });
    }
};