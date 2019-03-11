import React from 'react';

import Router from 'next/router';
import MainLayout from '../layouts/Main';
import Auth from '../lib/auth';

// This page is rendered when the user returns from Auth0 after logging in

class AuthorizePage extends React.Component {
  componentDidMount() {
    console.log('AuthorizePage path', Router.asPath);
    Auth.handleAuthentication()
      .then(authResult => {
        console.log('AuthorizePage login success');
        console.dir(authResult);
        Router.push(Auth.getSavedPath());
      })
      .catch(err => {
        console.log('AuthorizePage login failure');
        Router.push(Auth.getSavedPath());
      });
  }

  render() {
    return (
      <MainLayout>
        <p>Completing login...</p>
      </MainLayout>
    );
  }
}

export default AuthorizePage;
