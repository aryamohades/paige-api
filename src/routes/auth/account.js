const {
  authAccount: {
    getAuthUser,
    changeEmail,
    changePassword,
  },
} = require('../../controllers');
const { requireAuth } = require('../../middleware');
const { requireLogin } = require('../../middleware');

module.exports = router => {
  router.get('/api/users/me', requireAuth, getAuthUser);
  router.post('/api/email/change', requireLogin, changeEmail);
  router.post('/api/password/change', requireLogin, changePassword);
};
