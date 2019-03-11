import React from 'react';
import Router from 'next/router';
import Auth from '../lib/auth';

export default class Login extends React.Component {
  componentDidMount() {
    console.log('Login page');
    Auth.login();
  }

  render() {
    return null;
  }
}
