module.exports = (req, res, next) => {
    if(req.body.password) {
        next();
    }else {
        res.status(400).send('username and password required');
    }
};