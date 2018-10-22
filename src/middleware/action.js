const { Action } = require('../models');
const { QUERY_METHODS } = require('../constants');
const find = require('./find');

const getActionById = (end = false) => (
  find({
    end,
    model: Action,
    method: QUERY_METHODS.findOne,
    where: req => ({
      user_id: req.user.id,
      actionId: req.params.actionId,
    }),
    updateRequest: (req, data) => {
      req.action = data;
    },
  })
);

module.exports = {
  getActionById,
};
