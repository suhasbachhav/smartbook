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
                    res.cookie('cookie',"admin",{maxAge: 7200000, httpOnly: false, path : '/'});
                    res.cookie('userfullname',rows[0].name,{maxAge: 7200000, httpOnly: false, path : '/'});
                    res.cookie('userName',req.body.username,{maxAge: 7200000, httpOnly: false, path : '/'});
                    res.cookie('uid',rows[0].id,{maxAge: 7200000, httpOnly: false, path : '/'});
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
    var d = new Date();
    var currDateTime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var sqlQuery = 'UPDATE `vendor` SET `vendorName` = ? , `GSTIN` = ? ,  `exp_type` = ? ,  `vendorstatus` = ? ,  `createdBy` = ?, `updatedOn` = ?  WHERE `vendor`.`vid` = ?';
    pool.query(sqlQuery,[req.body.vendorName, req.body.vendorGSTIN, req.body.vendorExpenseType, req.body.vendorstatus, req.body.logId, currDateTime , req.body.vendorId ] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT vendor.*,users.name AS CreatedUser FROM vendor JOIN users ON users.id=vendor.createdBy', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})

app.post('/addVendor', function(req,res){
    var d = new Date();
    var currDateTime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var sqlQuery = 'INSERT INTO vendor (vendorName , GSTIN , exp_type , vendorstatus , createdBy, updatedOn) VALUES (?,?,?,?,?,?)';
    pool.query(sqlQuery,[req.body.vendorName, req.body.vendorGSTIN, req.body.vendorExpenseType, req.body.vendorstatus , req.body.logId, currDateTime] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT vendor.*,users.name AS CreatedUser FROM vendor JOIN users ON users.id=vendor.createdBy', (err, resultNew) => {
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

app.post('/addCompany', function(req,res){
    var d = new Date();
    var currDateTime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var sqlQuery = 'INSERT INTO company (comp_name , address , status , createdBy , updatedOn) VALUES (?,?,?,?,?)';
    pool.query(sqlQuery,[req.body.compName, req.body.compAdd, req.body.compstatus , req.body.logId ,currDateTime ] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT company.*,users.name AS CreatedUser FROM company JOIN users ON users.id=company.createdBy', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})
app.post('/editCompany', function(req,res){
    var d = new Date();
    var currDateTime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var sqlQuery = 'UPDATE `company` SET `comp_name` = ? , `address` = ? ,  `status` = ? ,  `createdBy` = ? , `updatedOn` = ?  WHERE `company`.`compID` = ?';
    pool.query(sqlQuery,[req.body.compName, req.body.compAdd, req.body.compStatus, req.body.logId, currDateTime,  req.body.compId] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT company.*,users.name AS CreatedUser FROM company JOIN users ON users.id=company.createdBy', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})
app.post('/editUnit', function(req,res){
    var d = new Date();
    var currDateTime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var sqlQuery = 'UPDATE `unit` SET `companyId` = ? , `unitno` = ? ,  `status` = ? ,  `createdBy` = ? , `updatedOn` = ?  WHERE `unit`.`coID` = ?';
    pool.query(sqlQuery,[req.body.unitCompany, req.body.unitNumber, req.body.unitStatus, req.body.logId, currDateTime,  req.body.unitId] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT unit.*,company.comp_name AS compName, company.address AS compAdd, users.name AS CreatedUser FROM unit JOIN users ON users.id=unit.createdBy JOIN company ON company.compID=unit.companyId', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})
app.post('/addUnit', function(req,res){
    var d = new Date();
    var currDateTime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var sqlQuery = 'INSERT INTO unit (companyId , unitno , status , createdBy , updatedOn) VALUES (?,?,?,?,?)';
    pool.query(sqlQuery,[req.body.unitCompany, req.body.unitName, req.body.unitStatus , req.body.logId ,currDateTime ] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT unit.*,company.comp_name AS compName, company.address AS compAdd, users.name AS CreatedUser FROM unit JOIN users ON users.id=unit.createdBy JOIN company ON company.compID=unit.companyId', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})
app.get('/unitlist', function(req,res){
    pool.query('SELECT unit.*,company.comp_name AS compName, company.address AS compAdd, users.name AS CreatedUser FROM unit JOIN users ON users.id=unit.createdBy JOIN company ON company.compID=unit.companyId', (err, result) => {
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
app.get('/expenselist', function(req,res){
    pool.query('SELECT expenses.*, users.name AS CreatedUser FROM expenses JOIN users ON users.id=expenses.createdBy', (err, result) => {
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
app.get('/paymentlist', function(req,res){
    pool.query('SELECT * FROM paymenttype', (err, result) => {
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
app.get('/activeExpenselist', function(req,res){
    pool.query('SELECT * FROM expenses WHERE status=1', (err, result) => {
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
app.post('/editExpense', function(req,res){
    var d = new Date();
    var sqlQuery = 'UPDATE `expenses` SET `expName` = ? , `createdBy` = ? ,  `status` = ?  WHERE `expenses`.`expId` = ?';
    pool.query(sqlQuery,[req.body.expenseName, req.body.logId, req.body.expenseStatus, req.body.expenseId] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT expenses.*, users.name AS CreatedUser FROM expenses JOIN users ON users.id=expenses.createdBy', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})
app.post('/addExpense', function(req,res){
    var d = new Date();
    //var currDateTime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var sqlQuery = 'INSERT INTO expenses (expName , status , createdBy) VALUES (?,?,?)';
    pool.query(sqlQuery,[req.body.expenseName, req.body.expenseStatus , req.body.logId ] , (err, result) => {
    if (err){
      res.status(400).send("Error in Connection");
    }else {
        pool.query('SELECT expenses.*, users.name AS CreatedUser FROM expenses JOIN users ON users.id=expenses.createdBy', (err, resultNew) => {
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end(JSON.stringify(resultNew));
        })
    }
  })
})
app.get('/vendorlist', function(req,res){
    pool.query('SELECT vendor.*,users.name AS CreatedUser FROM vendor JOIN users ON users.id=vendor.createdBy', (err, result) => {
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
app.get('/companylist', function(req,res){
    pool.query('SELECT company.*,users.name AS CreatedUser FROM company JOIN users ON users.id=company.createdBy', (err, result) => {
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
app.get('/activeCompanyList', function(req,res){
    pool.query('SELECT compID, comp_name , address FROM company WHERE status=1', (err, result) => {
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
app.get('/showUnitForCompany', function(req,res){
    pool.query('SELECT coID,unitno FROM unit WHERE status=1 AND companyId=?',[req.query.CompanyId], (err, result) => {
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
app.get('/getGSTNumber', function(req,res){
    pool.query('SELECT GSTIN FROM vendor WHERE vid=?',[req.query.vendorId], (err, result) => {
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

app.get('/monthlist', function(req,res){
    pool.query('SELECT mid, monthName FROM month', (err, result) => {
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
app.get('/paidStatuslist', function(req,res){
    pool.query('SELECT id, pName FROM paidstatus', (err, result) => {
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
app.get('/expenseslist', function(req,res){
    pool.query('SELECT * FROM expenses', (err, result) => {
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

app.get('/activeVendorList', function(req,res){
    pool.query('SELECT vid, vendorName FROM vendor WHERE vendorstatus=1', (err, result) => {
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