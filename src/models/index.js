const Sequelize = require('sequelize');
const fixtures = require('sequelize-fixtures');

const { DATABASE_URL } = process.env;

// Initialize sequelize
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  operatorsAliases: false,
  logging: false,
});

// Initialize models
const User = require('./user')(sequelize);
const Action = require('./action')(sequelize);
const Exec = require('./exec')(sequelize);

User.hasMany(Action, {
  as: 'actions',
  onDelete: 'cascade',
});

Action.belongsTo(User, { as: 'user' });

Action.hasMany(Exec, {
  as: 'execs',
  onDelete: 'cascade',
});

Exec.belongsTo(Action, { as: 'action' });

module.exports = {
  fixtures,
  sequelize,
  Sequelize,
  User,
  Action,
  Exec,
};
