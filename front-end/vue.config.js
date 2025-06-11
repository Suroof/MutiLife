module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "https://gnews.io",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
  // Transpile syntax that is not compatible with the browser
  transpileDependencies: ["@dcloudio/uni-ui"],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: "vue-loader",
              options: {
                compilerOptions: {
                  // Disable TS-related warnings in Vue files
                  whitespace: "preserve",
                },
              },
            },
          ],
        },
      ],
    },
  },
};
