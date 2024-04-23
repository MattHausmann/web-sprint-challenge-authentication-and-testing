const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets');

module.exports = (req, res, next) => {

  let token = req.headers.authorization;
 if(token) {
  try {
    let jwtValid = jwt.verify(token, secrets.jwtSecret);
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
