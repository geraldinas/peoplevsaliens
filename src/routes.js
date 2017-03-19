'use strict';

import React from 'react'
import { Route, IndexRoute } from 'react-router'

import HomePage from './components/HomePage';
import PeopleIndex from './components/PeopleIndex';
import PersonProfile from './components/PersonProfile';
import NotFoundPage from './components/NotFoundPage';

const routes = (
  <Route path="/" component={HomePage}>
    <IndexRoute component={PeopleIndex}/>
    <Route path="/people/:id" component={PersonProfile}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);

export default routes;
