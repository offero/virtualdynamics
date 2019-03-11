import React from 'react';

import MainLayout from '../layouts/Main';
import BooksContainer from '../components/BooksContainer';
import requiresAuth from '../hocs/requiresAuth';

const BooksPage = () => (
  <MainLayout>
    <BooksContainer />
  </MainLayout>
);

export default requiresAuth(BooksPage);
