module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: "https://localhost:8888",
  },
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false,
    },
  },
};
