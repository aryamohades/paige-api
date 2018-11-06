const {
  user: {
    getUser,
  },
} = require('../../controllers');

module.exports = router => {
  router.get('/api/users/:username', getUser);
};
