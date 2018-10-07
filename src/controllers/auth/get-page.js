const webdriverio = require('webdriverio');
const { BadRequestError } = require('../../errors');
const renderPage = require('../../scripts/render-page');
const {
  PAGE_SCRIPT,
  WEBDRIVER_OPTIONS,
  DEFAULT_PAGE_CONFIG
} = require('../../constants');

const getPage = async (req, res, next) => {
  let driver;

  try {
    const { url } = req.query;

    if (!url) {
      throw new BadRequestError('Missing url in query');
    }

    driver = webdriverio.remote(WEBDRIVER_OPTIONS).init();

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

    const script = PAGE_SCRIPT + `return PageService.run({
      includeTags: '${includeTags}',
      excludeTags: '${excludeTags}',
      includeHidden: ${includeHidden},
      includeZeroSize: ${includeZeroSize},
      includeMinWidth: ${includeMinWidth},
      includeMaxWidth: ${includeMaxWidth},
      includeMinHeight: ${includeMinHeight},
      includeMaxHeight: ${includeMaxHeight},
      includeMinDepth: ${includeMinDepth},
      includeMaxDepth: ${includeMaxDepth}
    })`;

    driver.windowHandleSize({
      width: screenWidth,
      height: screenHeight
    });

    await driver.url(url);

    const result = await driver.execute(script);

    if (result.status === 0) {
      renderPage(result.value);
    }

    res.send(result.value);
  } catch (e) {
    next(e);
  } finally {
    if (driver) {
      await driver.end();
    }
  }
};

module.exports = getPage;
