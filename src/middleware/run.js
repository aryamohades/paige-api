const { Run, Action } = require('../models');
const { QUERY_METHODS } = require('../constants');
const find = require('./find');

const getRunById = (end = false) => (
  find({
    end,
    model: Run,
    method: QUERY_METHODS.findOne,
    where: req => ({
      runId: req.params.runId,
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
  getRunById,
};
