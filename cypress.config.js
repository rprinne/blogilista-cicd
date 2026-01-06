const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3003'
  },
  env: {
    BACKEND: 'http://localhost:3003/api'
  }
});