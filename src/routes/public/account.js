const {
  account: {
    confirmEmail,
    forgotPassword,
    resetPassword,
  },
} = require('../../controllers');

module.exports = router => {
  router.post('/api/email/confirm', confirmEmail);
  router.post('/api/password/forgot', forgotPassword);
  router.post('/api/password/reset', resetPassword);
};
