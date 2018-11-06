const { User } = require('../../models');
const {
  find,
} = require('../../middleware');
const { QUERY_METHODS } = require('../../constants');

const getUser = find({
  model: User,
  method: QUERY_METHODS.findOne,
  where: req => ({
    username: req.params.username,
  }),
  attributes: [
    'username',
    'bio',
    'location',
    'createdAt',
  ],
});

module.exports = {
  getUser,
};
