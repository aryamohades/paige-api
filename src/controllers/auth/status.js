const os = require('os');

const startedAt = new Date();

const status = (req, res, next) => {
  const server = req.app;

  if (req.params.info) {
    res.send({
      status: 'up',
      version: server.get('version'),
      sha: server.get('git sha'),
      startedAt,
      node: {
        version: process.version,
        memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'M',
        uptime: process.uptime()
      },
      system: {
        loadavg: os.loadavg(),
        freeMemory: Math.round(os.freemem() / 1024 / 1024) + 'M'
      },
      env: process.env.NODE_ENV,
      hostname: os.hostname()
    });
  } else {
    res.send({ status: 'up' });
  }
};

module.exports = status;
