const {
  exec: {
    getExecs,
    getExec,
    createExec,
    deleteExec,
  },
} = require('../../controllers');
const { requireAuth, optionalAuth } = require('../../middleware');

module.exports = router => {
  router.get('/api/actions/:actionId/execs', requireAuth, getExecs);
  router.get('/api/actions/:actionId/execs/:execId', requireAuth, getExec);
  router.post('/api/actions/:actionId/execs', optionalAuth, createExec);
  router.delete('/api/actions/:actionId/execs/:execId', requireAuth, deleteExec);
};
