const {
  run: {
    getRuns,
    getRun,
    createRun,
    deleteRun,
  },
} = require('../../controllers');
const { requireAuth, optionalAuth } = require('../../middleware');

module.exports = router => {
  router.get('/api/actions/:actionId/runs', requireAuth, getRuns);
  router.get('/api/actions/:actionId/runs/:runId', requireAuth, getRun);
  router.post('/api/actions/:actionId/runs', optionalAuth, createRun);
  router.delete('/api/actions/:actionId/runs/:runId', requireAuth, deleteRun);
};
