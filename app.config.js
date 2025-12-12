import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  expo: {
    name: process.env.APP_NAME,
    slug: process.env.SLUG,
    version: process.env.VERSION,
    scheme: "bosscargo",

    web: {
      favicon: "./assets/favicon.png",
    },

    experiments: {
      tsconfigPaths: true,
    },

    plugins: [],

    orientation: "portrait",
    icon: "./assets/icon.png",

    userInterfaceStyle: "automatic",

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      statusBar: {
        style: "dark",
      },
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      statusBar: {
        barStyle: "dark-content",
        backgroundColor: "#ffffff",
        translucent: true,
      },
    },
  },
});
