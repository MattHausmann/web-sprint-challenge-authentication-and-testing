module.exports = (req, res, next) => {
    if(!req.body.username) {
        res.status(400).send("username and password required");
    }else {
        next();
    }
  };
  