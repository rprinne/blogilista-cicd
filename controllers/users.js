const bcryptjs = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', (req, res, next) => {
  User
    .find({}).populate('blogs', {url: 1, title: 1, author: 1})
    .then(users => {
      res.json(users);
    })
    .catch(error => next(error));
});

usersRouter.post('/', (req, res, next) => {
  const { username, name, password } = req.body;

  if (password === undefined) {
    return res.status(400).json({error: 'no password'});
  } else if (password.length < 3) {
    return res.status(400).json({error: 'password must have at least 3 characters'});
  }

  const saltRounds = 10;
  bcryptjs.hash(password, saltRounds)
    .then(passwordHash => {
      const user = new User({
        username,
        name,
        passwordHash,
      });
      return user.save();
    })
    .then(savedUser => {
      res.status(201).json(savedUser);
    })
    .catch(error => next(error));
});

module.exports = usersRouter;