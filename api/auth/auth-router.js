const router = require('express').Router();
const checkPasswordExists = require('../middleware/checkPasswordExists');
const checkUsernameExists = require('../middleware/checkUsernameExists');
const checkUsernameFree = require('../middleware/checkUsernameFree');
const Users = require('../users/users-model');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets');

router.post('/register', checkUsernameExists, checkPasswordExists, checkUsernameFree, (req, res) => {
  let hash = bcrypt.hashSync(req.body.password, 8);
  Users.add({username:req.body.username, password:hash})
  .then((user) => res.status(200).json(user));
});

router.post('/login', (req, res) => {
  let {username, password} = req.body;
  if(!username || !password) {
    res.status(400).send("username and password required")
  } else {    
    Users.findByUsername(username).then((user) =>{
      if(user) {
        let success = bcrypt.compareSync(password, user.password);
        if(success) {
          let token = generateToken(user);
          req.session.token = token;
          res.status(200).json({
            message:`welcome, ${username}`,
            token:token
          })
        } else {
          res.status(400).send("credentials invalid");
        }
      }
    })
  }
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username,
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away soty89p34 it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}

module.exports = router;
