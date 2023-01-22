module.exports = ({ config }) => {
  return {
    ...config,
    runtimeVersion: {
      policy: "sdkVersion",
    },
    android: {
      package: "com.bloopdevstudios.producto",
      adaptiveIcon: {
        foregroundImage: "./assets/splash-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    ios: {
      bundleIdentifier: "com.bloopdevstudios.producto",
      supportsTablet: true,
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/91edd9b2-7766-4ed5-88e8-8821573af2f6",
    },
    extra: {
      environment: "development",
      baseUrl: "http://localhost:3000",
      // environment: "production",
      // baseUrl: "https://producto-dev.herokuapp.com",
    },
  };
};
