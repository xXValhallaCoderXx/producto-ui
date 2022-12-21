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
      baseUrl: "https://cde2-2406-3003-2007-179f-2023-6cbb-9964-2abe.ngrok.io",
      // environment: "production",
      // baseUrl: "https://producto-dev.herokuapp.com",
    },
  };
};
