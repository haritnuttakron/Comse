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