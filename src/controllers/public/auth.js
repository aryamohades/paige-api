const { User } = require('../../models');
const {
  create,
  ifNotExists,
} = require('../../middleware');
const token = require('../../auth/token');

const login = (req, res) => {
  const {
    email,
    username,
    createdAt,
    notes,
  } = req.user;

  res.status(200).send({
    user: {
      email,
      username,
      createdAt,
      notes,
    },
    token: token(req.user),
  });
};

const register = [
  ifNotExists({
    model: User,
    fields: [
      'username',
      'email',
    ],
  }),
  create({
    model: User,
    data: req => ({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }),
    serialize: user => ({
      user: {
        email: user.email,
        username: user.username,
      },
      token: token(user),
    }),
  }),
];

module.exports = {
  login,
  register,
};
