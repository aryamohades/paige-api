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
const Run = require('./run')(sequelize);

User.hasMany(Action, {
  as: 'actions',
  onDelete: 'cascade',
});

Action.hasMany(Run, {
  as: 'runs',
  onDelete: 'cascade',
});

Run.belongsTo(Action, { as: 'action' });

module.exports = {
  fixtures,
  sequelize,
  Sequelize,
  User,
  Action,
  Run,
};
