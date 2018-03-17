import _ from 'lodash'

let config = {
  "env": process.env.NODE_ENV // "development" "production"
}

// 开发环境
if (process.env.NODE_ENV === 'development') {
  const devConfig = {
    port: '8080'
  }
  config = _.extend(config, devConfig)
}
// 生产环境
if (process.env.NODE_ENV === 'production') {
  const prodConfig = {
    port: '80'
  }
  config = _.extend(config, prodConfig)
}

export default config