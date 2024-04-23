const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets');

module.exports = (req, res, next) => {
  if(req.session) {
    req.headers.authorization = req.session.token;
  }

 if(req.headers.authorization) {
  try {
    let jwtValid = jwt.verify(req.headers.authorization, secrets.jwtSecret);
    if(jwtValid) {
      next();
    } else {
      res.status(400).send({message:"invalid or expired token"});
    }
  } catch(err) {
    res.status(400).send({message:"invalid or expired token"});
  }  
 } else {
  res.status(400).send({message:"token required"});
 }
};
