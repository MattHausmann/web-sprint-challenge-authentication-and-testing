module.exports = (req, res, next) => {
    if(req.body.password) {
        next();
    }else {
        res.status(400).json({message:'username and password required'});
    }
};