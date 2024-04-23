const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets');

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

  if(req.session) {
    req.headers.authorization = req.session.token;
  }

 if(req.headers.authorization) {
  try {
    req.headers.authorization = req.session.token;
    let jwtValid = jwt.verify(req.headers.authorization, secrets.jwtSecret);
    if(jwtValid) {
      next();
    }
  } catch(err) {
    res.status(400).send({message:"invalid or expired token"});
  }  
 } else {
  res.status(400).send({message:"token required"});
 }
};
