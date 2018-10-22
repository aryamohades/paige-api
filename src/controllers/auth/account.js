const { BadRequestError } = require('../../errors');
const smtpTransport = require('../../email');
const resetToken = require('../../auth/reset-token');

const {
  CONFIRM_EMAIL_URL,
  MAILGUN_EMAIL,
} = process.env;

const getAuthUser = (req, res) => {
  res.status(200).send(req.user);
};

/**
 * Change email handler
 *
 * Used to update a user's email while they are logged in
 */
const changeEmail = async (req, res, next) => {
  try {
    const {
      body: {
        email,
        confirmEmail,
      },
      user,
    } = req;

    if (email !== confirmEmail) {
      throw new BadRequestError('The emails do not match');
    }

    const token = await resetToken();
    const expiryDate = new Date();

    // Set token expiration to 1 day from now
    expiryDate.setDate(expiryDate.getDate() + 1);

    await user.update({
      resetEmail: email,
      resetEmailToken: token,
      resetEmailTokenExpiry: expiryDate,
    });

    const emailConfig = {
      to: email,
      from: MAILGUN_EMAIL,
      template: 'change-email',
      subject: 'Email Change Request',
      context: {
        url: `${CONFIRM_EMAIL_URL}${token}`,
        username: user.username,
      },
    };

    await smtpTransport.sendMail(emailConfig);

    res.status(200).send();
  } catch (e) {
    next(e);
  }
};

/**
 * Change password handler
 *
 * Used to update a user's password while they are logged in
 */
const changePassword = async (req, res, next) => {
  try {
    const {
      body: {
        newPassword,
        confirmPassword,
      },
      user
    } = req;

    if (newPassword !== confirmPassword) {
      throw new BadRequestError('The passwords do not match');
    }

    await user.update({
      password: newPassword,
    });

    const emailConfig = {
      to: user.email,
      from: MAILGUN_EMAIL,
      template: 'change-password-success',
      subject: 'Password Change Confirmation',
      context: {
        username: user.username,
      },
    };

    await smtpTransport.sendMail(emailConfig);

    res.status(200).send();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAuthUser,
  changeEmail,
  changePassword,
};
