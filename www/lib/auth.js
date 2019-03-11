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

// authResult has the shape:
// accessToken : "some-random-alpha-num"
// appState : null
// expiresIn : 7200
// idToken : "some-base64-hash-of-idTokenPayload-contents"
// idTokenPayload :
//   at_hash : "some-random-alpha-num"
//   aud : "some-random-alpha-num"
//   email : "offero@gmail.com"
//   email_verified : true
//   exp : 1528631224
//   family_name : "K"
//   gender : "other"
//   given_name : "Chris"
//   iat : 1528595224
//   iss : "https://offero.auth0.com/"
//   locale : "en"
//   name : "Chris K"
//   nickname : "offero"
//   nonce : "V8biU400qQ7yz_0DnJUedlo9Mc.5XRay"
//   picture : "https://lh3.googleusercontent.com/-DlesXNNBdU8/AAAAAAAAAAI/AAAAAAAAADw/da4mZwR0wPU/photo.jpg"
//   sub : "google-oauth2|103960056468135817388"
//   updated_at : "2018-06-10T01:47:04.322Z"
// refreshToken : null
// scope : null
// state : "LqZI7qdZwQDB9v7mmDjyxVSnENmvfF3."
// tokenType : "Bearer"

/*
accessToken: "-9QXA3ZKm4hePlgO88ZheVfOup9FRTec"
appState: null
expiresIn: 7200
idToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik56QTJPVVV4TkRFd1F6QXlORGhHTnpjNFJEWTBPRVUyUTBVME5UVkdOell4TWpBMU1EbEdOQSJ9.eyJnaXZlbl9uYW1lIjoiQ2hyaXMiLCJmYW1pbHlfbmFtZSI6IksiLCJuaWNrbmFtZSI6Im9mZmVybyIsIm5hbWUiOiJDaHJpcyBLIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tRGxlc1hOTkJkVTgvQUFBQUFBQUFBQUkvQUFBQUFBQUFBRHcvZGE0bVp3UjB3UFUvcGhvdG8uanBnIiwiZ2VuZGVyIjoib3RoZXIiLCJsb2NhbGUiOiJlbiIsInVwZGF0ZWRfYXQiOiIyMDE5LTAzLTEwVDIwOjUyOjQzLjgyNVoiLCJlbWFpbCI6Im9mZmVyb0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9vZmZlcm8uYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTAzOTYwMDU2NDY4MTM1ODE3Mzg4IiwiYXVkIjoiYkVFTXhobEQ5c0kyUlpYZVRndWlmaUU3SHBMQ21xNGciLCJpYXQiOjE1NTIyNTExNjMsImV4cCI6MTU1MjI4NzE2MywiYXRfaGFzaCI6Im9GeG0yb3pJNGp1U1h2VllpSDFBQ3ciLCJub25jZSI6IkUxZkE2bVhxVEw1elNwRXV6RDZ3WDdqWTdWME1FTGhzIn0.Qspn670NdSNtpe731MPVMSTB30P6wyNCPAcWxFIQyoDZIHBUSQNx0LmxqghEm4i8fM9PgrM7qaIOrup3CJsY_vBRFuNBwH5_BIRl3RQvvM0whTFF301Ei-haMJrl2wa0SgUxNNeZUH5500DeTgVHK4DQQ-xESuK98o4TERSgeM8gffw_-BSaL6OnosQ5g47UjAC_A-aGYBctDgHWCLha2_OOKBNLwxBfre5nUjLNqbkqsOiAYTi2QEcTw36ohG87KsztdbcaYfwoo40QUXyqgtE8-6mwGbXaEu5UPni6o2qEI322LRpdphN-3Ve1Xq3EyGizRMvj1olx-WbMt5lZmw"
idTokenPayload:
  at_hash: "oFxm2ozI4juSXvVYiH1ACw"
  aud: "bEEMxhlD9sI2RZXeTguifiE7HpLCmq4g"
  email: "offero@gmail.com"
  email_verified: true
  exp: 1552287163
  family_name: "K"
  gender: "other"
  given_name: "Chris"
  iat: 1552251163
  iss: "https://offero.auth0.com/"
  locale: "en"
  name: "Chris K"
  nickname: "offero"
  nonce: "E1fA6mXqTL5zSpEuzD6wX7jY7V0MELhs"
  picture: "https://lh3.googleusercontent.com/-DlesXNNBdU8/AAAAAAAAAAI/AAAAAAAAADw/da4mZwR0wPU/photo.jpg"
  sub: "google-oauth2|103960056468135817388"
  updated_at: "2019-03-10T20:52:43.825Z"
  __proto__: Object
refreshToken: null
scope: null
state: "JxyO8.7cXLVOSpt6S0qlQm66qKe-jaop"
tokenType: "Bearer"
*/
