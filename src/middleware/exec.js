const { Exec, Action } = require('../models');
const { QUERY_METHODS } = require('../constants');
const find = require('./find');

const getExecById = (end = false) => (
  find({
    end,
    model: Exec,
    method: QUERY_METHODS.findOne,
    where: req => ({
      execId: req.params.execId,
    }),
    include: [
      {
        model: Action,
        as: 'action',
        attributes: [
          'name',
          'actionId',
        ],
      },
    ],
  })
);

module.exports = {
  getExecById,
};
