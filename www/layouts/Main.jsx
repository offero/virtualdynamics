import Head from 'next/head';
import React from 'react';

import NavBar from '../components/NavBar';

class MainLayout extends React.Component {
  render() {
    const { children, title = 'offero.tech' } = this.props;
    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <NavBar />
        {children}
      </>
    );
  }
}

export default MainLayout;
