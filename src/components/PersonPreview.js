'use strict';

import React from 'react';
import { Link } from 'react-router';

export default class PersonPreview extends React.Component {
  render() {
    return (
      <Link to={`/people/${this.props.id}`}>
        <div className="alienperson-preview">
          <img src="/img/person-face.png"/>
          {/* <img src={`img/${this.props.image}`}/> */}
          <div className="alienperson-preview-details">
            <label className="alienperson-preview-label"> Name:</label>
            <h2 className="name">{this.props.name}</h2>
            <label className="alienperson-preview-label"> Favorite city: </label>
            <h2 className="name">{this.props.city}</h2>
          </div>
        </div>
      </Link>
    );
  }
}
