module.exports = {
  apps: [
    {
      name: "optischedule",
      script: "server.js",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
