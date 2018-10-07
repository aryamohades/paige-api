const login = require('./login');
const register = require('./register');
const forgotPassword = require('./forgot-password');
const resetPassword = require('./reset-password');
const confirmEmail = require('./confirm-email');

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  confirmEmail
};
