const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: { port: 8000 },

  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      title: 'BJJ Focus',
    },
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
});
