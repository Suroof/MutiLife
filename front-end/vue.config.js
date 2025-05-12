module.exports = {
  lintOnSave: false,
  // Transpile syntax that is not compatible with the browser
  transpileDependencies: ['@dcloudio/uni-ui'],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                compilerOptions: {
                  // Disable TS-related warnings in Vue files
                  whitespace: 'preserve'
                }
              }
            }
          ]
        }
      ]
    }
  }
}