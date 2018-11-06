const {
  action: {
    getActions,
    getAction,
    createAction,
    editAction,
    deleteAction,
  },
} = require('../../controllers');
const { requireAuth, optionalAuth } = require('../../middleware');

module.exports = router => {
  router.get('/api/actions', optionalAuth, getActions);
  router.get('/api/actions/:actionId', optionalAuth, getAction);
  router.post('/api/actions', requireAuth, createAction);
  router.post('/api/actions/:actionId', requireAuth, editAction);
  router.delete('/api/actions/:actionId', requireAuth, deleteAction);
};
