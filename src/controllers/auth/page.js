const puppeteer = require('puppeteer-core');
const { BadRequestError } = require('../../errors');
const pageScript = require('../../scripts/page-service');
const renderPage = require('../../scripts/render-page');
const { DEFAULT_PAGE_CONFIG } = require('../../constants');

const { BROWSERLESS_URL } = process.env;

const getPage = async (req, res, next) => {
  let browser;

  try {
    const { url } = req.query;

    if (!url) {
      throw new BadRequestError('Missing url in query');
    }

    const {
      screenWidth = DEFAULT_PAGE_CONFIG.screenWidth,
      screenHeight = DEFAULT_PAGE_CONFIG.screenHeight,
      includeTags = DEFAULT_PAGE_CONFIG.includeTags,
      excludeTags = DEFAULT_PAGE_CONFIG.excludeTags,
      includeHidden = DEFAULT_PAGE_CONFIG.includeHidden,
      includeZeroSize = DEFAULT_PAGE_CONFIG.includeZeroSize,
      includeMinWidth = DEFAULT_PAGE_CONFIG.includeMinWidth,
      includeMaxWidth = DEFAULT_PAGE_CONFIG.includeMaxWidth,
      includeMinHeight = DEFAULT_PAGE_CONFIG.includeMinHeight,
      includeMaxHeight = DEFAULT_PAGE_CONFIG.includeMaxHeight,
      includeMinDepth = DEFAULT_PAGE_CONFIG.includeMinDepth,
      includeMaxDepth = DEFAULT_PAGE_CONFIG.includeMaxDepth
    } = req.query;

    const width = Number(screenWidth);
    const height = Number(screenHeight);

    if (!Number.isInteger(width) || width < 0) {
      throw new BadRequestError('Screen width must be a positive integer');
    }

    if (!Number.isInteger(height) || height < 0) {
      throw new BadRequestError('Screen height must be a positive integer');
    }

    browser = await puppeteer.connect({
      browserWSEndpoint: BROWSERLESS_URL,
      defaultViewport: {
        width,
        height,
      },
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    const result = await page.evaluate(pageScript, {
      includeTags,
      excludeTags,
      includeHidden,
      includeZeroSize,
      includeMinWidth,
      includeMaxWidth,
      includeMinHeight,
      includeMaxHeight,
      includeMinDepth,
      includeMaxDepth,
    });

    renderPage(result);

    res.send(result);
  } catch (e) {
    next(e);
  } finally {
    if (browser) {
      browser.disconnect();
    }
  }
};

module.exports = {
  getPage,
};
