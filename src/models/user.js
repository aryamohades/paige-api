const Sequelize = require('sequelize');
const {
  encrypt,
  normalizeEmail,
} = require('../auth/credentials');

const DataTypes = Sequelize.DataTypes;

module.exports = sequelize => {
  const User = sequelize.define('user', {
    username: {
      field: 'username',
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 18],
        isAlphanumeric: true,
      },
    },
    email: {
      field: 'email',
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      field: 'password',
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [6, 128],
          msg: 'Must be between 6 and 128 characters',
        },
      },
    },
    role: {
      field: 'role',
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isValidRole(value) {
          if (value !== 'admin' && value !== 'user') {
            throw new Error(`Invalid role: ${value}`);
          }
        },
      },
    },
    location: {
      field: 'location',
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      field: 'bio',
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      field: 'reset_password_token',
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordTokenExpiry: {
      field: 'reset_password_token_expiry',
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetEmailToken: {
      field: 'reset_email_token',
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetEmailTokenExpiry: {
      field: 'reset_email_token_expiry',
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetEmail: {
      field: 'reset_email',
      type: DataTypes.STRING,
      allowNull: true,
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
          'password',
        ],
      },
    },
    scopes: {
      login: {
        attributes: [
          'id',
          'username',
          'email',
          'createdAt',
          'password',
        ],
      },
    },
    indexes: [
      {
        unique: true,
        fields: [
          'email',
          'username',
        ],
      },
    ],
    timestamps: false,
    underscored: true,
  });

  User.beforeCreate(data => {
    data.email = normalizeEmail(data.email);

    return encrypt(data.password).then(hashedPw => {
      data.password = hashedPw;
    });
  });

  User.beforeUpdate((data, next) => {
    if (!data.changed('password')) {
      return next();
    }

    return encrypt(data.password).then(hashedPw => {
      data.password = hashedPw;
    });
  });

  return User;
};
