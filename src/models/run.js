const Sequelize = require('sequelize');
const cuid = require('cuid');
const { RUN_STATUS } = require('../constants');

const DataTypes = Sequelize.DataTypes;

module.exports = sequelize => {
  const Run = sequelize.define('run', {
    runId: {
      field: 'run_id',
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => cuid(),
    },
    status: {
      field: 'status',
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: RUN_STATUS.RUNNING,
      validate: {
        isIn: [[
          RUN_STATUS.RUNNING,
          RUN_STATUS.SUCCESS,
          RUN_STATUS.ERROR,
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
          'run_id',
        ],
      },
    ],
    timestamps: false,
    underscored: true,
  });

  return Run;
};
