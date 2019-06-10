module.exports = {
  target: 'serverless',
  env: {
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    AUTH_AUDIENCE: process.env.AUTH_AUDIENCE,
  },
};
