const puppeteer = require('puppeteer-core');
const aws = require('aws-sdk');
const { Run, Action } = require('../../models');
const logger = require('../../logger');

const {
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
} = process.env;

const s3 = new aws.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const {
  find,
  remove,
  action: {
    getActionById,
  },
  run: {
    getRunById,
  },
} = require('../../middleware');
const {
  QUERY_METHODS,
  RUN_STATUS,
} = require('../../constants');

const jQueryPath = require.resolve('jquery');
const underscorePath = require.resolve('underscore');

const { BROWSERLESS_URL } = process.env;

const pageFunction = (context, func) => func(context);

const getRuns = [
  getActionById(),
  find({
    model: Run,
    method: QUERY_METHODS.findAndCountAll,
    where: req => ({
      action_id: req.action.id,
    }),
    include: {
      model: Action,
      as: 'action',
      attributes: [
        'name',
        'actionId',
      ],
    },
  }),
];

const getRun = [
  getActionById(),
  getRunById(true),
];

const createRun = [
  getActionById(),
  async (req, res, next) => {
    const { action } = req;

    let browser;
    let contextHandle;
    let funcHandle;
    let pendingRun;

    try {
      const requestStartTime = new Date().toISOString();

      pendingRun = await Run.create({
        action_id: action.id,
        requestUrl: action.url,
        status: RUN_STATUS.RUNNING,
        startedAt: requestStartTime,
      });

      if (action.isAsync) {
        res.send(pendingRun);
      }

      browser = await puppeteer.connect({
        browserWSEndpoint: BROWSERLESS_URL,
      });

      const page = await browser.newPage();

      const pageResponse = await page.goto(action.url, {
        waitUntil: 'networkidle2',
      });

      if (action.useJQuery) {
        await page.addScriptTag({
          path: jQueryPath,
        });
      }

      if (action.useUnderscore) {
        await page.addScriptTag({
          path: underscorePath,
        });
      }

      contextHandle = await page.evaluateHandle(() => ({
        jQuery: window.jQuery,
        underscore: window._,
      }));

      funcHandle = await page.evaluateHandle(funcString => (
        new Function(`return ${funcString}.apply(null, arguments)`) // eslint-disable-line no-new-func
      ), action.script);

      const pageFunctionResult = await page.evaluate(
        pageFunction,
        contextHandle,
        funcHandle,
      );

      if (req.query.screenshot === 'true') {
        const pageScreenshot = await page.screenshot({
          fullPage: true,
        });

        const screenshotKey = `${action.actionId}-${pendingRun.runId}`;

        const params = {
          Bucket: S3_BUCKET_NAME,
          Key: screenshotKey,
          Body: pageScreenshot,
        };

        logger.info(`[s3] starting image upload with key: ${screenshotKey}`);

        s3.upload(params, async err => {
          if (err) {
            logger.error(`[s3] image upload failed with error: ${err.message}`);
          } else {
            logger.info(`[s3] image upload success with key: ${screenshotKey}`);

            await pendingRun.update({
              screenshotKey,
              screenshotUploaded: true,
            });
          }
        });
      }

      const requestFinishTime = new Date().toISOString();

      await pendingRun.update({
        responseData: pageFunctionResult,
        responseStatus: pageResponse.status(),
        responseHeaders: pageResponse.headers(),
        status: RUN_STATUS.SUCCESS,
        finishedAt: requestFinishTime,
      });

      if (!action.isAsync) {
        res.send(pageFunctionResult);
      }
    } catch (e) {
      if (pendingRun) {
        await pendingRun.update({
          status: RUN_STATUS.ERROR,
          errorMessage: e.message,
          finishedAt: new Date().toISOString(),
        });
      }

      next(e);
    } finally {
      if (browser) {
        browser.disconnect();
      }

      if (contextHandle) {
        await contextHandle.dispose();
      }

      if (funcHandle) {
        await funcHandle.dispose();
      }
    }
  },
];

const deleteRun = [
  getActionById(),
  remove({
    model: Run,
    where: req => ({
      action_id: req.action.id,
      runId: req.params.runId,
    }),
  }),
];

module.exports = {
  getRuns,
  getRun,
  createRun,
  deleteRun,
};
