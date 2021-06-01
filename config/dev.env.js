'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env.js')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_IIIFAPI: '"http://127.0.0.1:8182"',
  VUE_APP_ESAPI: '"https://es.saw-leipzig.de/"'
})
