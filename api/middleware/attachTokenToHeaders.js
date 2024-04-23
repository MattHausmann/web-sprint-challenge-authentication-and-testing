module.exports = (req, res, next) => {
    if(req.session.token) {
        req.headers.authorization = req.session.token;
    }
    next();
}