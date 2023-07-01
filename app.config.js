module.exports = ({ config }) => {
  return {
    ...config,
    plugins: ["expo-localization"],
    runtimeVersion: {
      policy: "sdkVersion",
    },
    android: {
      package: "com.bloopdevstudios.producto",
      versionCode: 4,
      adaptiveIcon: {
        foregroundImage: "./assets/splash-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    ios: {
      bundleIdentifier: "com.bloopdevstudios.producto",
      supportsTablet: true,
      buildNumber: "4",
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/91edd9b2-7766-4ed5-88e8-8821573af2f6",
    },
    extra: {
      // environment: "development",
      // baseUrl: "http://192.168.10.132:3000",
      environment: "production",
      baseUrl: "https://producto-dev.herokuapp.com",
      eas: {
        projectId: "91edd9b2-7766-4ed5-88e8-8821573af2f6",
      },
    },
  };
  a;
};
