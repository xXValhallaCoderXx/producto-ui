module.exports = ({ config }) => {
    return {
      ...config,
      extra: {
        environment: "development",
        baseUrl: "http://10.0.2.2:3000",
        // environment: "production",
        // baseUrl: "https://producto-dev.herokuapp.com",
      },
    };
  };
  