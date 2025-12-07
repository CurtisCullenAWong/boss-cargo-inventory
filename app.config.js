export default ({ config }) => ({
  ...config,
  expo: {
    name: "Boss Cargo Inventory",
    slug: "boss-cargo-inventory",
    version: "1.0.0",

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
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
  },
});
