const { Action } = require('../../models');
const {
  find,
  create,
  edit,
  remove,
} = require('../../middleware');
const { QUERY_METHODS } = require('../../constants');

const getActions = find({
  model: Action,
  method: QUERY_METHODS.findAndCountAll,
  where: req => ({
    user_id: req.user.id,
  }),
});

const getAction = find({
  model: Action,
  method: QUERY_METHODS.findOne,
  where: req => ({
    user_id: req.user.id,
    actionId: req.params.actionId,
  }),
});

const createAction = create({
  model: Action,
  reload: true,
  data: req => ({
    user_id: req.user.id,
    name: req.body.name,
    url: req.body.url,
    script: req.body.script,
    actionId: `${req.user.username}~${req.body.name}`,
    isPublic: req.body.isPublic,
    useJQuery: req.body.useJQuery,
    useUnderscore: req.body.useUnderscore,
    cacheResponse: req.body.cacheResponse,
    cacheDuration: req.body.cacheDuration,
    webhook: req.body.webhook,
  }),
});

const editAction = edit({
  model: Action,
  where: req => ({
    user_id: req.user.id,
    actionId: req.params.actionId,
  }),
  data: req => {
    const data = {
      url: req.body.url,
      script: req.body.script,
      isPublic: req.body.isPublic,
      useJQuery: req.body.useJQuery,
      useUnderscore: req.body.useUnderscore,
      cacheResponse: req.body.cacheResponse,
      cacheDuration: req.body.cacheDuration,
      webhook: req.body.webhook,
    };

    if (req.body.name) {
      data.name = req.body.name;
      data.actionId = `${req.user.username}~${req.body.name}`;
    }

    return data;
  },
});

const deleteAction = remove({
  model: Action,
  where: req => ({
    user_id: req.user.id,
    actionId: req.params.actionId,
  }),
});

const bustCache = (req, res, next) => {
  res.send('ok');
};

module.exports = {
  getActions,
  getAction,
  createAction,
  editAction,
  deleteAction,
  bustCache,
};
