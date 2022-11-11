module.exports = ({ config }) => {
  return {
    ...config,
    runtimeVersion: {
      policy: "sdkVersion",
    },
    android: {
      package: "com.bloopdevstudios.producto",
      windowSoftInputMode: "adjustPan",
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
      baseUrl: "https://brave-dodos-search-103-4-198-126.loca.lt",
      // environment: "production",
      // baseUrl: "https://producto-dev.herokuapp.com",
    },
  };
};
