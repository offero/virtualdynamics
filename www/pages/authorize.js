import React from 'react';

import Router from 'next/router';
import MainLayout from '../layouts/Main';
import Auth from '../lib/auth';

// This page is rendered when the user returns from Auth0 after logging in

class AuthorizePage extends React.Component {
  componentDidMount() {
    Auth.handleAuthentication()
      .then(authResult => {
        Router.push(Auth.getSavedPath());
      })
      .catch(err => {
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
