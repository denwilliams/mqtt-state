const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

exports.create = (filePath) => {
  return {
    save(state) {
      // TODO: debounce and use async
      writeFileSync(filePath, JSON.stringify(state), 'utf8');
    },
    load() {
      if (!existsSync(filePath)) return {};
      return JSON.parse(readFileSync(filePath, 'utf8'));
    }
  }
};
