var conf    = require('../config.js');
var mysql   = require('mysql');
var connection = mysql.createConnection({
    host     : conf.database.host,
    user     : conf.database.user,
    password : conf.database.password,
    database : conf.database.database
});
connection.connect();

module.exports = {
    query : function(sql,cb) {
        var res = {};
        var p = new Promise((resolve,reject)=> {
            connection.query(sql, function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            });
        });
        p.then((results)=>{
            console.log(results);
            cb(results);
        })
        .catch((reason)=> {
            console.log('Handle rejected promise ('+reason+') here.');
        })
    },
    bar : function() {
        console.log(connection);
    }
};