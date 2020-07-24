import React, { createContext, useContext } from 'react';
import { notification, page, service } from '../prop-types';

const DataContext = createContext({});

// Create a Context Provider React component to allow consuming components to subscribe to context changes.
// The value property represents the data accessible to all consuming component that are descendants of the Provider.
// The Provider will re-render whenever the Provider’s value prop changes.
const DataProvider = ({ data, children }) => (
  <DataContext.Provider value={data}>{children}</DataContext.Provider>
);

DataProvider.propTypes = {
  page: page,
  service: service,
  notification: notification
};

// The useContext hook accepts a context object and returns the value set in the Context Provider.
// Create a wrapper function to get the value from the DataContext.Provider.
const useDataContext = () => useContext(DataContext);

export {
  DataContext,
  DataProvider,
  useDataContext
};
