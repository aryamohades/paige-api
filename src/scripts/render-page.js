const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const mkdirp = require('mkdirp');

const { DEPTH_COLORS } = require('../constants');

const numColors = DEPTH_COLORS.length;

const baseStyle = fs.readFileSync(path.join(
  __dirname,
  './styles/base.css',
)).toString();

const shadeColor = (color, percent) => {
  const f = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = f >> 16;
  const G = f >> 8 & 0x00FF;
  const B = f & 0x0000FF;
  return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
};

module.exports = data => {
  const $ = cheerio.load('<!doctype html><html><head><title></title></head><body></body></html>');
  const style = $(`<style>${baseStyle}</style>`);

  for (let i = 0; i < data.elements.length; ++i) {
    const element = data.elements[i];

    if (data.maxDepth === 0) {
      data.maxDepth = 1;
    }

    const colorIndex = parseInt((numColors - 1) * (1.0 * element.depth / data.maxDepth), 10);
    const hoverColor = shadeColor(DEPTH_COLORS[colorIndex], 0.25);

    style.append(`[data-id="${element.id}"]:hover {
      background:${hoverColor} !important;
      border: 2px dashed #54a0ff;
    }`);

    let el = $('<div></div>');

    if (element.tagName === 'img') {
      el = $('<img>');
      el.attr(
        'src',
        `https://imgplaceholder.com/${element.size.width}x${element.size.height}/dfe6e9/a9b6bc/fa-image`,
      );
    }

    el.attr('data-id', element.id);

    el.css({
      position: 'absolute',
      background: DEPTH_COLORS[colorIndex],
      'z-index': element.depth,
      width: element.size.width + 'px',
      height: element.size.height + 'px',
      left: element.position.x + 'px',
      top: element.position.y + 'px',
    });

    if (element.numChildren === 0 && element.text) {
      el.text(element.text);
    }

    $('body').append(el);
  }

  $('head').append(style);

  const buildDir = path.join(__dirname, '../../build');
  const filePath = path.join(__dirname, '../../build/index.html');

  mkdirp(buildDir, err => {
    if (!err) {
      fs.writeFileSync(filePath, $.html(), { flag: 'w' });
    }
  });
};
