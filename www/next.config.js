module.exports = {
  target: 'serverless',
  // serverRuntimeConfig: available on server only
  serverRuntimeConfig: {},
  // publicRuntimeConfig: available on both client and server
  publicRuntimeConfig: {
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    AUTH_AUDIENCE: process.env.AUTH_AUDIENCE,
  },
};
