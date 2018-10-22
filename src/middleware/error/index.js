const handleError = require('./handler');

module.exports = app => {
  app.use((err, req, res, next) => {
    try {
      handleError(err);
    } catch (e) {
      err = e;
    }

    const response = err.json
      ? err.json()
      : { message: err.message };

    let responseCode;

    if (err.code && Number.isInteger(err.code)) {
      responseCode = err.code;
    } else {
      responseCode = 500;
    }

    res.status(responseCode).send(response);
  });
};
