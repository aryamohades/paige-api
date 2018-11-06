const Sequelize = require('sequelize');
const cuid = require('cuid');
const { EXEC_STATUS } = require('../constants');

const DataTypes = Sequelize.DataTypes;

module.exports = sequelize => {
  const Exec = sequelize.define('exec', {
    execId: {
      field: 'exec_id',
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => cuid(),
    },
    status: {
      field: 'status',
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: EXEC_STATUS.RUNNING,
      validate: {
        isIn: [[
          EXEC_STATUS.RUNNING,
          EXEC_STATUS.SUCCESS,
          EXEC_STATUS.ERROR,
        ]],
      },
    },
    requestUrl: {
      field: 'request_url',
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    responseData: {
      field: 'response_data',
      type: DataTypes.JSONB,
      allowNull: true,
    },
    responseStatus: {
      field: 'response_status',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    responseHeaders: {
      field: 'response_headers',
      type: DataTypes.JSONB,
      allowNull: true,
    },
    errorMessage: {
      field: 'error_message',
      type: DataTypes.STRING,
      allowNull: true,
    },
    screenshotKey: {
      field: 'screenshot_key',
      type: DataTypes.STRING,
      allowNull: true,
    },
    screenshotUploaded: {
      field: 'screenshot_uploaded',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    startedAt: {
      field: 'started_at',
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    finishedAt: {
      field: 'finished_at',
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    defaultScope: {
      attributes: {
        exclude: [
          'action_id',
          'id',
        ],
      },
    },
    indexes: [
      {
        unique: true,
        fields: [
          'exec_id',
        ],
      },
    ],
    timestamps: false,
    underscored: true,
  });

  return Exec;
};
