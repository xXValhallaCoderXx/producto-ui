// export default {

// };

module.exports = ({ config }) => {
  console.log(config); // prints 'My App'
  return {
    ...config,
    android: {
      package: "com.xxvalhallacoderxx.producto",
    },
    extra: {
      // environment: "production",
      environment: "development",
      baseUrl: "http://10.0.2.2:3000",
      // baseUrl: "https://producto-dev.herokuapp.com",
    },
  };
};
