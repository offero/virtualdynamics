import React from 'react';
import Router from 'next/router';
import Auth from '../lib/auth';

function requiresAuth(WrappedComponent) {
  class RequiresAuth extends React.Component {
    state = {
      loggedIn: false,
    };

    componentDidMount() {
      if (!Auth.isAuthenticated()) {
        Router.push('/login');
      } else {
        this.setState({
          loggedIn: true,
        });
      }
    }

    render() {
      const { loggedIn } = this.state;
      if (!loggedIn) {
        return <div>Unauthorized</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return RequiresAuth;
}

export default requiresAuth;
