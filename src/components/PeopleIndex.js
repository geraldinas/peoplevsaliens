'use strict';

import React from 'react';
import PersonPreview from './PersonPreview';
import request from 'superagent';

export default class PeopleIndex extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {people: []};
  }
  handleSubmit(evt) {
    evt.preventDefault();
    request.post(`/api/people`)
      .send({
        name: String(evt.target.personName.value),
        city: String(evt.target.personFavoriteCity.value)
      })
      .end((err, response) => {
        if (err) {
          return alert(`failed to make a person :(\n\n${err.stack}`);
        }
        alert('success!');
        window.location.reload();
      });
  }
  fetchState() {
    request.get('/api/people').end((err, response) => {
      if (err) {
        console.log('failed to get stuff... retrying...');
        setTimeout(() => this.fetchState(), 200);
        return;
      }
      this.setState({people: response.body});
    });
  }

  componentDidMount() {
    this.fetchState();
  }

  render() {
    return (
      <div className="home">
        <p className="home-dek"> <strong>A place to find the favorite cities of all of your favorite people and aliens</strong></p>
        <div className="alienperson-form">
          <label className="form-input-label"> Enter new Contestant: </label>
          <form action="/api/people" method="post" onSubmit={this.handleSubmit}>
            <label className="new-person-input-label">
              Name:
              <input type="text" name="personName"/>
            </label>
            <label className="new-person-input-label">
              Favorite city:
              <input type="text" name="personFavoriteCity" />
            </label>
            <div className="button"><button type="submit">Submit!</button></div>
          </form>
        </div>
        <div className="people-selector">
          {this.state.people.map(personData => <PersonPreview key={personData.id} {...personData} />)}
        </div>
      </div>
    );
  }
}
