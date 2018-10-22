const {
  action: {
    getActions,
    getAction,
    createAction,
    editAction,
    deleteAction,
  },
} = require('../../controllers');
const { requireAuth } = require('../../middleware');

module.exports = router => {
  router.get('/api/actions', requireAuth, getActions);
  router.get('/api/actions/:actionId', requireAuth, getAction);
  router.post('/api/actions', requireAuth, createAction);
  router.post('/api/actions/:actionId', requireAuth, editAction);
  router.delete('/api/actions/:actionId', requireAuth, deleteAction);
};
