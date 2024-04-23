let Users = require('../users/users-model');

module.exports = (req, res, next) => {
    let username = req.body.username;
    Users.findByUsername(username).then((user) => {
        console.log(user);
        if(user) {
            res.status(400).json({message:"username taken"});
        } else {
            next();
        }
    });
}