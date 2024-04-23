module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
 console.log("in restrict!");
 console.log(req.headers);
 if(req.headers.cookie) {
  console.log(req.headers.cookie);
  next();
 } else {
  console.log("token required");
  res
    .status(400)
    .send("token required");
 }


};
