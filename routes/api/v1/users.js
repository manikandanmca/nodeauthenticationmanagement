const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jswt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../../config/keys.js');
const ValidateRegisterInput = require('../../../validation/register');
const ValidateLoginInput = require('../../../validation/login');
// Load User model

const User = require('../../../models/User');

router.get('/test', (req,res) =>  res.json({message: "User Works"}) );

router.post('/register', (req, res) => {
  // validate the user input

  const { errors, isValid } = ValidateRegisterInput(req.body);

  if(!isValid) {
    return res.status(400).json({errors});
  }

  User.findOne({ email: req.body.email })
  .then(user => {
    if(user) {
      return res.status(400).json({email: 'Email already exist'});	
    } else {
      const avatar = gravatar.url(req.body.emai, {
        s: '200',
        r: 'pg',
        d: 'mm'	
      });
      const newUser = new User({ 
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err))
        });
      });	
    }

  })

});

router.post('/login', (req, res) => {
  const { errors, isValid } = ValidateLoginInput(req.body);

  if(!isValid) {
    return res.status(400).json({errors});
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        res.status(404).json({message: 'User not found'})
      }

      bcrypt.compare(password, user.password)
      .then(isMatch => {
        if(isMatch) {
          const payload = { id: user.id, name: user.name, avatar: user.avatar };
          jswt.sign(payload,
                   keys.secretOrKey, 
                   {expiresIn: 3600}, 
                   (err, token) => {
                      res.json({
                        message: true, 
                        token: 'Bearer ' + token 
                      });
                   }
          );
        }
        else {
          res.status(400).json({message: 'Password incorrect'});
        }
      });

    });
});

router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, email: req.user.email});
});

module.exports = router;