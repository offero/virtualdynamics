import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import getIndexMessage from '../lib/getIndexMessage';
import Typography from '@material-ui/core/Typography';
import MainLayout from '../layouts/Main';
import Auth from '../lib/auth';

export default class Index extends Component {
  // static async getInitialProps({ query, req, res }) {
  //   const protocol = process.env.BROWSER ? '' : process.env.PROTOCOL || 'http';
  //   const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
  //   const message = await getIndexMessage(baseUrl);
  //   return { message };
  // }

  // static get defaultProps() {
  //   return {
  //     message: 'default message',
  //   };
  // }

  // static get propTypes() {
  //   return {
  //     message: PropTypes.string,
  //   };
  // }
  state = {
    name: 'User',
  };

  componentDidMount() {
    if (Auth.isAuthenticated()) {
      this.setState({
        name: Auth.getUserName(),
      });
    }
  }

  render() {
    const { name } = this.state;
    const message = `Welcome, ${name}`;
    return (
      <MainLayout>
        <Typography variant="h6">{message}</Typography>
      </MainLayout>
    );
  }
}
