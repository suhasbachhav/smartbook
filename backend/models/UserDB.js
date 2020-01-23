var mysql = require('mysql');

var pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'smartbook',
    timezone: 'ist',
    multipleStatements: true
});

module.exports = pool;