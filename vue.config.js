module.exports = {
  publicPath: "./",
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "书香中国";
      return args;
    });
  },
};
