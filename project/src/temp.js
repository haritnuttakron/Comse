if(isLogin){
  //token คือ jwt.sign(payload มีiat=issue at timeหรือ เวลาสร้างด้วย, secretOrPrivateKey, [options, callback])
  var token = jwt.sign({ email: users[0].email }, secret);
  //โครงสร้าง res.json(body)
  res.json({status : 'ok',message:'login success',token})
}else{
  res.json({status : 'error',message:'login failed'})
}