import { WebAuth } from 'auth0-js';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const domain = publicRuntimeConfig.AUTH0_DOMAIN;
const clientID = publicRuntimeConfig.AUTH0_CLIENTID;

const isBrowser = () => process.browser;

function getWebAuth() {
  return new WebAuth({
    domain,
    clientID,
    redirectUri: `${window.location.origin}/authorize`,
    responseType: 'token id_token',
    scope: 'openid profile email',
  });
}

const PRELOGIN_PATH = '__PRELOGIN_PATH';

// TODO: change this class to just an exported object
export default class Auth {
  static isAvailable() {
    return isBrowser();
  }

  static savePath(path) {
    localStorage.setItem(PRELOGIN_PATH, path);
  }

  static getSavedPath() {
    return localStorage.getItem(PRELOGIN_PATH);
  }

  static login() {
    getWebAuth().authorize();
  }

  static getUserInfo() {
    if (!isBrowser()) return {};

    return JSON.parse(localStorage.getItem('idTokenPayload')) || {};
  }

  static getUserName() {
    const user = Auth.getUserInfo();
    return user.given_name || user.name || user.nickname || user.email || 'User';
  }

  static refresh() {
    if (!isBrowser()) return;

    getWebAuth().checkSession(
      {
        responseType: this.responseType,
        scope: this.scope,
      },
      (err, authResult) => {
        if (err) {
          console.log('auth refresh failed');
          console.log(err);
          window.location.assign('/');
          // TODO: make this log in again
          return;
        }
        Auth.setSession(authResult);
        console.log('auth refresh succeeded');
        console.log(authResult);
        // TODO: remove log lines
        window.location.assign('/');
        // TODO: change this
      }
    );
  }

  static handleAuthentication() {
    console.log('handleAuthentication isBrowser', isBrowser());
    return new Promise((resolve, reject) => {
      getWebAuth().parseHash((err, authResult) => {
        if (err) {
          console.log('error in authentication');
          console.log(err);
          return reject(err);
        }

        console.log('authResult');
        console.dir(authResult);
        Auth.setSession(authResult);
        return resolve(authResult);
      });
    });
  }

  static setSession(authResult) {
    if (!isBrowser()) return;

    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('idToken', authResult.idToken);
    localStorage.setItem('expiresAt', JSON.stringify(expiresAt));
    localStorage.setItem('idTokenPayload', JSON.stringify(authResult.idTokenPayload));
  }

  static logout() {
    if (!isBrowser()) return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('idTokenPayload');
    window.location.assign('/');
  }

  static isAuthenticated() {
    if (!isBrowser()) return false;
    const expiresAt = JSON.parse(localStorage.getItem('expiresAt')) || undefined;
    return new Date().getTime() < expiresAt;
  }
}
