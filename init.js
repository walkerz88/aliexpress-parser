const fs = require('fs');

fs.copyFile('example_config.js', 'config.js', e => {
  if (e) throw new Error(e);
  console.log('config.js created.');
  console.log('You can start now:');
  console.log('$ npm run start');
});