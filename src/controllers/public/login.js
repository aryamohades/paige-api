const token = require('../../auth/token');

const login = (req, res) => {
  const {
    email,
    username,
    createdAt,
  } = req.user;

  res.status(200).send({
    user: {
      email,
      username,
      createdAt,
    },
    token: token(req.user),
  });
};


module.exports = login;
