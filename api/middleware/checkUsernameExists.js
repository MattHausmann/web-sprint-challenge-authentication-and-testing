module.exports = (req, res, next) => {
    if(!req.body.username) {
        res.status(400).json({message:"username and password required"});
    }else {
        next();
    }
  };
  