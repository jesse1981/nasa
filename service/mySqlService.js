var mySql = require('mysql'); 

module.exports = function(logFactory, config) {
  var pool = mySql.createPool(config.database);

  this.entries = function(cb) {
    pool.getConnection(function(err, connection) {
      if(err)
        return cb(err); 
      
      connection.query("SELECT * FROM crm WHERE MAJOR_CATEGORY_CODE = 'WASTE_MAN'", function(err, rows) {
        if(err)
          return cb(err);

        connection.release();

        return cb(null, rows);
      });
    });
  }

  this.addressLookup = function(param, cb) {
    pool.getConnection(function(err, connection) {
      if(err)
        return cb(err); 
      
      var sql = "select * \
      from propaddr \
      where ParcelFlag = \"R\" \
      and NoState like ? \
      and HouseNumber is not NULL \
      order by HouseNumber";
      var query = mySql.format(sql, '%' + param + '%');

      connection.query(query, function(err, rows) {
        if(err)
          return cb(err);

        connection.release();

        return cb(null, rows);
      });
    });
  }
}