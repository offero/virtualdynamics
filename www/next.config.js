module.exports = {
  target: 'serverless',
  publicRuntimeConfig: {
    AUTH0_CLIENTID: process.env.AUTH0_CLIENTID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  },
};
