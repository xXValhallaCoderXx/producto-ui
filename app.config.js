module.exports = ({ config }) => {
  return {
    ...config,
    android: {
      package: "com.xxvalhallacoderxx.producto",
    },
    extra: {
      // environment: "development",
      // baseUrl: "http://10.0.2.2:3000",
      environment: "production",
      baseUrl: "https://producto-dev.herokuapp.com",
    },
  };
};
