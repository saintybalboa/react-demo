import React from 'react';
import Homepage from './pages/Homepage';
import Service from './pages/Service';
import { fetchHomepage, fetchService } from './fetchers';

const routes =  [
  {
    path: '/',
    element: <Homepage />,
    // Assign the service fetcher to ensure the initial data is fetched for the homepage
    fetchInitialData: fetchHomepage
  },
  {
    path: '/services/:id',
    element: <Service />,
    // Assign the service fetcher to ensure the initial data is fetched for the service page
    fetchInitialData: fetchService
  }
];

export default routes;
