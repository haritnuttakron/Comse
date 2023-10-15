var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const mysql = require('mysql2');

const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var jsonParser = bodyParser.json()
var app = express()
const saltRounds = 10; 
const secret = 'login'
var otp;
app.use(cors())

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  port:'3306',
  database: 'newbackend'
});

app.post('/register', jsonParser,function (req, res, next) {
  try{
    connection.execute(
      'SELECT * FROM users WHERE email=?',
      [req.body.email],
      function (err, users, fields) {
        if (err) {
          res.json({ status: 'error', message: err });
          return
        }
        else if(users.length !== 0){
          res.json({status: 'error', message: 'This email is already used!' });
          return
        }
        else{
          const password = req.body.password;
          if (password.length <= 7 || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) //ต้องมากกว่า7 มีพิมเล็ก พิมใหญ่
          {
            res.json({ status: 'error', message: 'Password must be at least 8 characters long and contain both uppercase and lowercase letters.' });
            return;
          }
          else{
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
          }
        }
      });
    }
    catch(err){
      res.json({ status: 'error', message: err });
    }
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
          //token คือ jwt.sign(payload มีiat=issue at timeหรือ เวลาสร้างด้วย, secretOrPrivateKey, [options, callback])
          var token = jwt.sign({ email: users[0].email }, secret);
          //โครงสร้าง res.json(body)
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
    var decoded = jwt.verify(token, secret);console.log(decoded)
    res.json({status :'ok',decoded})
  }catch(err){
    res.json({status :'error',message:err.message})
  }
  
})
app.post('/changepass', jsonParser,function (req, res, next) {
  try{
      const token = req.headers.authorization.split(' ')[1]
      var decoded = jwt.verify(token, secret);console.log(decoded)
      connection.execute(
        'SELECT * FROM users WHERE email=?',
        [decoded.email],
        (err, users)=> {
          if (err) {
            console.log('error')
            res.json({ status: 'error', message: err });
            return
          }
          else{
            console.log('nerror')
            bcrypt.compare(req.body.password, users[0].password,(err, isLogin)=>{
              if(!isLogin){
                res.json({status : 'error',message:'Wrong password'})
                return
              }
              else{
                bcrypt.hash(req.body.newpassword, saltRounds,function (err, hash) {
                  console.log('hash')
                  if (err) {
                    res.json({ status: 'error', message: err })
                    return;
                  }
                  console.log(hash);
                  connection.execute(
                    'UPDATE users SET password = ? WHERE email = ?',
                    [hash,decoded.email],
                    (err,value) =>{
                      if (err) {
                        res.json({ status: 'error', message: err.message });
                        return
                      }
                      else{
                        res.json({status : 'ok',message:'Password Changed'})
                      }
                    });
                });
              } 
            });
          }
        })
    }catch(err){
      res.json({ status: 'error', message: err });
  }
})

app.post('/sentotp', jsonParser,function (req, res, next) {
  try{
  console.log('start otp')
  connection.execute(
    'SELECT * FROM users WHERE email=?',
    [req.body.email],
    function (err, users, fields) {
      if (err) {
        res.json({ status: 'error', message: err });
        return
      }else if(users.length == 0){
        res.json({status: 'error', message: 'no user found' });
        return
      }else{
        console.log('fetched')
        let transporter = nodemailer.createTransport({
          host: 'gmail',
          service: 'Gmail',
          auth: {
              user: 'rerollsave01@gmail.com',
              pass: 'eqzm hgnn jzrr hqkh',
          },
        });
        // รายละเอียดอีเมล
        otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        transporter.sendMail({
            from: 'Customer Service <rerollsave01@gmail.com>',  // ผู้ส่ง
            to: "<"+req.body.email+">",                                          // ผู้รับ
            subject: "Reset Password",                          // หัวข้อ
            text: "your otp is: "+otp,                          // ข้อความ
        }, (err, info) => {
            if (err) {
              res.json({status: 'error', message: err.message });
            } else {
              res.json({status : 'ok',message:'otp sent'})
            }
        });
      }
    });
  }catch(err){
    res.json({status :'error',message:err.message})
  }  
})
app.post('/confirmotp', jsonParser,function (req, res, next) {
  if(req.body.otp===otp){
    var token = jwt.sign({ email: req.body.email }, secret);
      //โครงสร้าง res.json(body)
      res.json({status : 'ok',message:'login success',token})
  }else{
    res.json({status : 'error',message:'login failed'})
  }

  
})
app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 5000')
})