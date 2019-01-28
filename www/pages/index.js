import React, { Component } from 'react';
import getIndexMessage from '../lib/getIndexMessage';
import PropTypes from 'prop-types';

export default class Index extends Component {
  static async getInitialProps({ query, req, res }) {
    const protocol = process.env.BROWSER ? '' : process.env.PROTOCOL || 'http';
    const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
    const message = await getIndexMessage(baseUrl);
    return { message };
  }

  static get defaultProps() {
    return {
      message: 'default message',
    };
  }

  static get propTypes() {
    return {
      message: PropTypes.string,
    };
  }

  render() {
    const { message } = this.props;
    return (
      <div>
        <p>{ message }</p>
      </div>
    );
  }
}
