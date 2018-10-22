/* eslint-disable no-var, prefer-arrow-callback */
module.exports = opts => { // eslint-disable-line no-unused-vars
  var sessionId = null;
  var numElements = 0;
  var maxDepth = 0;
  var elementMap = {};
  var options;

  /**
   * Generate unique id for this session
   */
  function generateId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function(c) {
      return 'data-' + (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    });
  }

  /**
   * Get page width
   */
  function getPageWidth() {
    return window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth ||
      document.body.offsetWidth;
  }

  /**
   * Get page height
   */
  function getPageHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    );
  }

  /**
   * Use element's computed style to determine if element is hidden
   *
   * @param {object} style
   */
  function isElementHidden(style) {
    if (style.opacity === '0' || style.display === 'none') {
      return true;
    }

    return false;
  }

  /**
   * Determine if element has a non empty text node child
   *
   * @param {Node|HTMLElement} el
   */
  function hasNonEmptyTextNode(el) {
    var child = el.firstChild;

    while (child) {
      if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
        return true;
      }
      child = child.nextSibling;
    }

    return false;
  }

  /**
   * Get element's top left corner coordinates,
   * measured from top left of page = (0, 0)
   *
   * @param {Node|HTMLElement} el
   */
  function getElementPosition(el) {
    var box = el.getBoundingClientRect();

    var body = document.body;
    var docElem = document.documentElement;

    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    var x = left;
    var y = top;

    return {
      x: x,
      y: y,
    };
  }

  /**
   * Get element's tag specific attributes
   *
   * @param {Node|HTMLElement} el
   * @param {object} data
   */
  function getElementAttributes(el, data) {
    if (data.tagName === 'a') {
      data.href = el.href;
    } else if (data.tagName === 'img') {
      data.src = el.src;
    }
  }

  /**
   * Uee element data and session options to determine if element is included in response
   *
   * @param {object} data
   */
  function isElementIncluded(data) {
    if (data.isHidden && !options.includeHidden) {
      return false;
    }

    if (options.includeTags && !options.includeTags.has(data.tagName)) {
      return false;
    } else if (options.excludeTags && options.excludeTags.has(data.tagName)) {
      return false;
    }

    if (!options.includeZeroSize &&
      (data.size.width <= 1 || data.size.height <= 1)
    ) {
      return false;
    }

    if ((options.includeMinWidth && data.size.width < options.includeMinWidth) ||
      (options.includeMaxWidth && data.size.width > options.includeMaxWidth) ||
      (options.includeMinHeight && data.size.height < options.includeMinHeight) ||
      (options.includeMaxHeight && data.size.height > options.includeMaxHeight)
    ) {
      return false;
    }

    if (options.includeMaxDepth && data.depth > options.includeMaxDepth) {
      return false;
    }

    if (options.includeMinDepth && data.depth < options.includeMinDepth) {
      return false;
    }

    if (data.position === 'fixed' && !options.includeFixedPosition) {
      return false;
    }

    return true;
  }

  /**
   * Unwrap all children of dom element
   *
   * @param {Node|HTMLElement} el
   */
  function unwrapChildren(el) {
    var children = el.children;

    if (!children) {
      return;
    }

    for (var i = 0; i < children.length; ++i) {
      if (children[i].nodeType !== Node.TEXT_NODE) {
        unwrap(children[i]);
      }
    }

    if (el.firstElementChild) {
      unwrapChildren(el);
    }
  }

  /**
   * Unwrap element
   *
   * @param {Node|HTMLElement} el
   */
  function unwrap(el) {
    var parent = el.parentNode;

    while (el.firstChild) {
      parent.insertBefore(el.firstChild, el);
    }

    parent.removeChild(el);
  }

  /**
   * Get element's width and height in pixels
   *
   * @param {Node|HTMLElement} el
   */
  function getElementSize(el) {
    return {
      width: el.offsetWidth,
      height: el.offsetHeight,
    };
  }

  /**
   * Extract data from DOM element
   *
   * @param {Node|HTMLElement} el
   */
  function getElementData(el) {
    var style = window.getComputedStyle(el);

    var data = {
      isHidden: isElementHidden(style),
      tagName: el.tagName.toLowerCase(),
      className: el.className,
      size: getElementSize(el),
      position: getElementPosition(el),
      id: numElements,
      parentId: el.parentElement.getAttribute(sessionId),
      numChildren: el.childElementCount,
      borderRadius: style.borderRadius,
      children: [],
      positionType: style.position,
    };

    if (hasNonEmptyTextNode(el)) {
      data.text = el.textContent;
    }

    getElementAttributes(el, data);

    var parentData = elementMap[data.parentId];

    if (parentData) {
      data.depth = parentData.depth + 1;
      data.numSiblings = parentData.numChildren - 1;
      maxDepth = Math.max(maxDepth, data.depth);
      parentData.children.push(data.id);
    } else {
      // Initialize root element
      data.depth = 0;
    }

    el.setAttribute(sessionId, numElements);
    elementMap[numElements] = data;

    return data;
  }

  /**
   * Iterate through DOM and get data for all elements
   */
  function processElements() {
    var queue = [document.body];
    var elements = [];

    while (queue.length !== 0) {
      var el = queue.pop();

      if (hasNonEmptyTextNode(el)) {
        unwrapChildren(el);
      }

      var elementData = getElementData(el);

      if (isElementIncluded(elementData)) {
        elements.push(elementData);
      }

      if (!elementData.isHidden || options.includeHidden) {
        try {
          for (var i = 0; i < el.childElementCount; ++i) {
            queue.push(el.children[i]);
          }
        } catch (err) {
          // ignore: attempting to access children fails with some elements like svg
        }
      }

      numElements++;
    }

    return elements;
  }

  /**
   * Set options for this session
   *
   * @param {object} sessionOptions
   */
  function setOptions(sessionOptions) {
    options = sessionOptions;

    if (options.includeTags) {
      options.includeTags = new Set(options.includeTags.split(','));
    } else if (options.excludeTags) {
      options.excludeTags = new Set(options.excludeTags.split(','));
    }

    sessionId = generateId();
  }

  setOptions(opts);

  var elementsData = processElements();

  return Promise.resolve({
    title: document.title,
    url: window.location.href,
    pageWidth: getPageWidth(),
    pageHeight: getPageHeight(),
    maxDepth: maxDepth,
    numElements: elementsData.length,
    elements: elementsData,
  });
};
