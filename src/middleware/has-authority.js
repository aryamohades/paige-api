const roles = require('../auth/roles');
const { UnauthorizedError } = require('../errors');

const hasAuthority = (role) => (
  (req, res, next) => {
    try {
      const { user } = req;

      if (roles[user.role] > role) {
        throw new UnauthorizedError();
      }

      next();
    } catch (e) {
      next(e);
    }
  }
);

module.exports = hasAuthority;
