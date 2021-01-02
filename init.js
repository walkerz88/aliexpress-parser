const fs = require('fs');
const printByColor = require('./src/helpers/printByColor');

fs.copyFile('example_config.js', 'config.js', e => {
  if (e) throw new Error(e);
  console.log('Config file created.');
  console.log('Please run:');
  printByColor('cyan', '$ npm run start\n');
});