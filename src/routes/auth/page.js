const {
  page: {
    getPage,
  },
} = require('../../controllers');
const { requireAuth } = require('../../middleware');

module.exports = router => {
  router.get('/api/page', requireAuth, getPage);
};
