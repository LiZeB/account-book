const path = require('path');

module.exports = {
  publicPath: '/account-web',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    }
  },
  devServer: {
    proxy: {
      '/account-web': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/account-web': '/'
        }
      }
    }
  }
}