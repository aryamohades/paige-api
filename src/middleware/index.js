const requireLogin = require('./require-login');
const requireAuth = require('./require-auth');
const optionalAuth = require('./optional-auth');
const error = require('./error');
const find = require('./find');
const create = require('./create');
const remove = require('./remove');
const edit = require('./edit');
const ifNotExists = require('./if-not-exists');
const hasAuthority = require('./has-authority');
const action = require('./action');
const exec = require('./exec');

module.exports = {
  error,
  requireLogin,
  requireAuth,
  optionalAuth,
  find,
  create,
  remove,
  edit,
  ifNotExists,
  hasAuthority,
  action,
  exec,
};
