'use strict';

import React from 'react';
import { Link } from 'react-router';
import request from 'superagent';

export default class HomePage extends React.Component {
  render() {
    return (
      <div className="app-container">
        <header>
          <Link to="/api/people"> <img className="logo" src="/img/gorn.png"/></Link>
          <h1 className="title"> People vs Aliens</h1>
        </header>
        <div className="app-content">{this.props.children}</div>
        <footer><strong> By: Geraldina Sonsoles Alvarez Garcia </strong></footer>
      </div>
    );
  }
}
