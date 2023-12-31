var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var jsonParser = bodyParser.json()
var app = express()
const saltRounds = 10;
const secret = 'login'

app.use(cors())

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  port:'3307',
  database: 'newbackend'
});

app.post('/register', jsonParser,function (req, res, next) {
  const password = req.body.password;
  if (password.length <= 7 || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    res.json({ status: 'error', message: 'Password must be at least 8 characters long and contain both uppercase and lowercase letters.' });
    return;
  }
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (err) {
      res.json({ status: 'error', message: err })
      return;
    }
    connection.execute(
      'INSERT INTO users (email, fname , lname  , password ) VALUES (?,?,?,?)',
      [req.body.email,req.body.fname, req.body.lname,  hash, ],
      function (err, results, fields) {
        if (err) {
          res.json({ status: 'error', message: err })
          return
        }
        res.json({ status: 'ok', message: "Success" })
      });
  });
})
app.post('/login', jsonParser,function (req, res, next) {
  connection.execute(
    'SELECT * FROM users WHERE email=?',
    [req.body.email],
    function (err, users, fields) {
      if (err) {
        res.json({ status: 'error', message: err });
        return
      }if(users.length == 0){
        res.json({status: 'error', message: 'no user found' });
        return
      }
      bcrypt.compare(req.body.password, users[0].password, function (err, isLogin) {
        if(isLogin){
          var token = jwt.sign({ email: users[0].email }, secret);
          res.json({status : 'ok',message:'login success',token})
        }else{
          res.json({status : 'error',message:'login failed'})
        }
      });
    });
})
app.post('/authen', jsonParser,function (req, res, next) {
  try{
    const token = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(token, secret);console.log( decoded)
    res.json({status :'ok',decoded})
  }catch(err){
    res.json({status :'error',message:err.message})
  }
  
})


app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 5000')
})