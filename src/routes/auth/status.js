const { status } = require('../../controllers');

const {
  requireAuth,
  hasAuthority
} = require('../../middleware');

const roles = require('../../auth/roles');

module.exports = (router) => {
  router.get('/api/status', requireAuth, hasAuthority(roles.admin), status);
};
