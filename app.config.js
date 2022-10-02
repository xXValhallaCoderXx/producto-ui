module.exports = ({ config }) => {
  return {
    ...config,
    runtimeVersion: {
      policy: "sdkVersion",
    },
    // android: {
    //   package: "com.xxvalhallacoderxx.producto",
    //   softwareKeyboardLayoutMode: "pan",
    // },
    // ios: {
    //   supportsTablet: true,
    //   bundleIdentifier:"com.xxvalhallacoderxx.producto",
    //   buildNumber: "1.0.0",
    // },
    extra: {
      environment: "development",
      baseUrl: "http://10.0.2.2:3000",
      // environment: "production",
      // baseUrl: "https://producto-dev.herokuapp.com",
    },
  };
};
