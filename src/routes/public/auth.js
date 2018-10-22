const {
  auth: {
    login,
    register,
  },
} = require('../../controllers');
const { requireLogin } = require('../../middleware');

module.exports = router => {
  router.post('/api/login', requireLogin, login);
  router.post('/api/register', register);
};
