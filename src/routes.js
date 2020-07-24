import Homepage from './pages/Homepage';
import Service from './pages/Service';
import { fetchHomepage, fetchService } from './fetchers';

const routes =  [
  {
    path: '/',
    exact: true,
    component: Homepage,
    // Assign the service fetcher to ensure the initial data is fetched for the homepage
    fetchInitialData: fetchHomepage
  },
  {
    path: '/services/:id',
    exact: false,
    component: Service,
    // Assign the service fetcher to ensure the initial data is fetched for the service page
    fetchInitialData: fetchService
  }
];

export default routes;
