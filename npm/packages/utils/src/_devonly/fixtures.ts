const path = require('path');
const fs = require('fs');

const basicHtml = fs.readFileSync(path.join(__dirname, 'basic.html'), 'utf8');

module.exports = {
  basic: basicHtml,
};
