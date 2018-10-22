const { Op } = require('sequelize');
const { User } = require('../../models');
const { find } = require('../../middleware');
const { BadRequestError } = require('../../errors');
const smtpTransport = require('../../email');
const resetToken = require('../../auth/reset-token');

const {
  LOGIN_URL,
  RESET_PASSWORD_URL,
  MAILGUN_EMAIL,
} = process.env;

/**
 * Forgot password handler
 *
 * Used to initiate the reset password process.
 */
const forgotPassword = [
  find({
    model: User,
    method: 'findOne',
    where: req => ({
      email: req.body.email,
    }),
    updateRequest: (req, data) => {
      req.user = data;
    },
    end: false,
  }),
  async (req, res, next) => {
    try {
      const { user } = req;

      const token = await resetToken();
      const expiryDate = new Date();

      // Set token expiration to 1 day from now
      expiryDate.setDate(expiryDate.getDate() + 1);

      await user.update({
        resetPasswordToken: token,
        resetPasswordTokenExpiry: expiryDate,
      });

      const email = {
        to: user.email,
        from: MAILGUN_EMAIL,
        template: 'reset-password',
        subject: 'Password Reset Request',
        context: {
          url: `${RESET_PASSWORD_URL}${token}`,
          username: user.username,
        },
      };

      await smtpTransport.sendMail(email);

      res.status(200).send();
    } catch (e) {
      next(e);
    }
  },
];

/**
 * Reset password handler
 *
 * Used to create a new password after user has completed forgot reset process.
 */
const resetPassword = [
  find({
    model: User,
    method: 'findOne',
    where: req => ({
      resetPasswordToken: req.body.token,
      resetPasswordTokenExpiry: {
        [Op.gt]: Date.now(),
      },
    }),
    updateRequest: (req, data) => {
      req.user = data;
    },
    end: false,
  }),
  async (req, res, next) => {
    try {
      const {
        body: {
          password,
          confirmPassword,
        },
        user,
      } = req;

      if (password !== confirmPassword) {
        throw new BadRequestError('The passwords do not match');
      }

      await user.update({
        password,
      });

      await user.update({
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      });

      const email = {
        to: user.email,
        from: MAILGUN_EMAIL,
        template: 'reset-password-success',
        subject: 'Password Reset Confirmation',
        context: {
          url: LOGIN_URL,
          username: user.username,
        },
      };

      await smtpTransport.sendMail(email);

      res.status(200).send();
    } catch (e) {
      next(e);
    }
  },
];

const confirmEmail = [
  find({
    model: User,
    method: 'findOne',
    where: req => ({
      resetEmailToken: req.body.token,
      resetEmailTokenExpiry: {
        [Op.gt]: Date.now(),
      },
    }),
    updateRequest: (req, data) => {
      req.user = data;
    },
    end: false,
  }),
  async (req, res, next) => {
    try {
      const { user } = req;

      await user.update({
        email: user.resetEmail,
      });

      await user.update({
        resetEmail: null,
        resetEmailToken: null,
        resetEmailTokenExpiry: null,
      });

      const email = {
        to: user.email,
        from: MAILGUN_EMAIL,
        template: 'change-email-success',
        subject: 'Email Change Confirmation',
        context: {
          username: user.username,
        },
      };

      await smtpTransport.sendMail(email);

      res.status(200).send({
        email: user.email,
      });
    } catch (e) {
      next(e);
    }
  },
];

module.exports = {
  forgotPassword,
  resetPassword,
  confirmEmail,
};
