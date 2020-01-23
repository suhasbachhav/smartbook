var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var pool = require('./models/UserDB.js');
app.set('view engine', 'ejs');
app.use(cors({ origin: 'http://localhost:5000', credentials: true }));

app.use(cookieParser());

app.use(session({
    secret              : 'cmpe_273_secure_string',
    resave              : false,
    saveUninitialized   : true,
    duration            : 30 * 60 * 1000,
    activeDuration      :  5 * 60 * 1000
}));

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

pool.query('select * from users',  function(err, rows){
    if(err) throw err;
    else 
      console.log("Connection to DB established");
});  
app.get('/logout', function(request, response) {
    request.session.destroy();
    response.redirect('/'); 
})

app.post('/login',function(req,res){
    var d = new Date();
    var currDateTime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    pool.query('SELECT * FROM users where username = ?',req.body.username, function (err,rows) {
        if(typeof(rows[0].password) == "undefined"){
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Un-successful Login");

        }else if(rows[0].password === req.body.password){
            pool.query('UPDATE `users` SET `lastLogin` = ? WHERE `users`.`id` = ?',[currDateTime, rows[0].id], function (err) {
                if (err) {
                    res.writeHead(400,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Un-successful Login");

                } else {
                    req.session.SessUser = req.body.username;
                    res.cookie('cookie',"admin",{maxAge: 1800000, httpOnly: false, path : '/'});
                    res.cookie('userfullname',rows[0].name,{maxAge: 1800000, httpOnly: false, path : '/'});
                    res.cookie('userName',req.body.username,{maxAge: 1800000, httpOnly: false, path : '/'});
                    res.cookie('uid',rows[0].id,{maxAge: 1800000, httpOnly: false, path : '/'});
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Successful Login");
                }
            });
        } else {
            res.writeHead(400,{
                'Content-Type' : 'text/plain'
            })
            res.end("Un-successful Login");
        }
    })
});


app.post('/editUser', function(req,res){
    //var body = req.body;
    var sqlQuery = 'UPDATE `users` SET `name` = ? , `email` = ? ,  `userroll` = ? ,  `createdBy` = ?, `status` = ?  WHERE `users`.`id` = ?';
        
    pool.query(sqlQuery,[req.body.userName, req.body.userEmail, req.body.userRoll, req.body.logId, req.body.userStatus, req.body.userId ] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT A.*,userrolltable.userrollname AS uRollName, B.username AS createdUser FROM users A JOIN userrolltable ON userrolltable.access = A.userroll JOIN users B ON A.createdBy=B.id', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})

app.post('/editVendor', function(req,res){
    //var body = req.body;
    var sqlQuery = 'UPDATE `vendor` SET `vendorName` = ? , `GSTIN` = ? ,  `exp_type` = ? ,  `vendorstatus` = ?  WHERE `vendor`.`vid` = ?';
        
    pool.query(sqlQuery,[req.body.vendorName, req.body.vendorGSTIN, req.body.vendorExpenseType, req.body.vendorstatus, req.body.vendorId ] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT * FROM vendor', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})

app.post('/addVendor', function(req,res){
    var sqlQuery = 'INSERT INTO vendor (vendorName , GSTIN , exp_type , vendorstatus) VALUES (?,?,?,?)';
    pool.query(sqlQuery,[req.body.vendorName, req.body.vendorGSTIN, req.body.vendorExpenseType, req.body.vendorstatus] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT * FROM vendor', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})

app.post('/addUser', function(req,res){
    var sqlQuery = 'INSERT INTO users (username , password , name , email , userroll, createdBy, status) VALUES (?,?,?,?,?,?,?)';
    pool.query(sqlQuery,[req.body.userName , req.body.userPassword , req.body.userFullName , req.body.userEmail , req.body.userRoll ,  req.body.logId , req.body.userStatus] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT A.*,userrolltable.userrollname AS uRollName, B.username AS createdUser FROM users A JOIN userrolltable ON userrolltable.access = A.userroll JOIN users B ON A.createdBy=B.id', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})

app.get('/vendorlist', function(req,res){
    pool.query('SELECT * FROM vendor', (err, result) => {
        if (err){
          res.status(400).send("Error in Connection");
        }else {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(result));
        }
    })
})
app.post('/checkUser', function(req,res){
    pool.query('SELECT username FROM users WHERE username = ?', [req.body.userName], (err, result) => {
        if (err){
          res.status(400).send("Error in Connection");
        }else {
            if (result.length > 0) {
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end(JSON.stringify(result));
            }else{
                res.status(400).send("not exist");
            }
        }
    })
})


app.get('/userrolllist', function(req,res){
    pool.query('SELECT access,userrollname FROM userrolltable', (err, result) => {
        if (err){
          res.status(400).send("Error in Connection");
        }else {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(result));
        }
    })
})
app.get('/userlist', function(req,res){
    pool.query('SELECT A.*,userrolltable.userrollname AS uRollName, B.username AS createdUser , A.userroll FROM users A JOIN userrolltable ON userrolltable.access = A.userroll JOIN users B ON A.createdBy=B.id ', (err, result) => {
        if (err){
          res.status(400).send("Error in Connection");
        }else {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(result));
        }
    })
})

//Route to delete an user
app.delete('/delete/:id',function(req,res){
    console.log("In Delete Post");
    console.log("The user to be deleted is ", req.params.id);
    
    pool.query('DELETE FROM user where studentID = ?', [req.params.id], (err, rows) => {
        if (err){
          console.log("User Not Found");
            res.writeHead(400,{
            'Content-Type' : 'text/plain'
        })
            res.end("User not found");
        } else {
            console.log("User ID " + req.params.id + " was removed successfully");
            pool.query('SELECT * FROM user', (err, result) => {
                if (err){
                  console.log(err);
                  res.status(400).send("Error in Connection");
                }else {
                    console.log("users list: ",JSON.stringify(result));
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end(JSON.stringify(result));
                 }
            })
         }
      })
});

//start your server on port 5001
app.listen(5001);
console.log("Server Listening on port 5001");