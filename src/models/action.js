const Sequelize = require('sequelize');

const DataTypes = Sequelize.DataTypes;

module.exports = sequelize => {
  const Action = sequelize.define('action', {
    name: {
      field: 'name',
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 18],
        isAlpha: true,
      },
    },
    url: {
      field: 'url',
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    script: {
      field: 'script',
      type: DataTypes.TEXT,
      allowNull: true,
    },
    actionId: {
      field: 'action_id',
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAsync: {
      field: 'isAsync',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isPublic: {
      field: 'is_public',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    useJQuery: {
      field: 'inject_jquery',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    useUnderscore: {
      field: 'use_underscore',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    cacheResponse: {
      field: 'cache_response',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    cacheDuration: {
      field: 'cache_duration',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    webhook: {
      field: 'webhook',
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    defaultScope: {
      attributes: {
        exclude: [
          'user_id',
        ],
      },
    },
    indexes: [
      {
        unique: true,
        fields: [
          'action_id',
        ],
      },
    ],
    timestamps: false,
    underscored: true,
  });

  return Action;
};
