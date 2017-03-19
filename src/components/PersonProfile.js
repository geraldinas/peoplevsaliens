'use strict';

import React from 'react';
import { Link } from 'react-router';
import NotFoundPage from './NotFoundPage';
import request from 'superagent';

export default class PersonProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { person: null, editing: null };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fetchState() {
    request.get(`/api/people/${this.props.params.id}`).end((err, response) => {
      if (err) {
        console.log('failed to get stuff... retrying...');
        setTimeout(() => this.fetchState(), 200);
        return;
      }
      this.setState({person: response.body});
    });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    request.patch(`/api/people/${this.props.params.id}`)
      .send({
        name: String(evt.target.personName.value),
        city: String(evt.target.personFavoriteCity.value)
      })
      .end((err) => {
        if (err) {
          return alert(`Something went wrong!\n\n${err.stack}`);
        }
        alert('Successfully Edited!');
        window.location.reload();
      });
  }

  componentDidMount() {
    this.fetchState();
  }

  toggleEditing( value ) {
    this.setState({editing: value});
  }

  renderItemOrEditField ( state ) {
    if (this.state.editing) {
      return (
        <div className="person-details">
          <form action="/api/people/:id" method="patch" onSubmit={this.handleSubmit.bind(this)}>
            <label className="new-person-input-label">
              Name:
              <input type="text" name="personName"/>
            </label>
            <label className="new-person-input-label">
              Favorite city:
              <input type="text" name="personFavoriteCity" />
            </label>
            <button type="submit">Submit!</button>
          </form>
        </div>
      )
    } else {
      return (
      <div className="person-details">
        <h2 className="name"> Name: {state.person.name}</h2>
        <h2 className="city"> Favorite City: {state.person.city}</h2>
        <button className="edit-field" onClick={this.toggleEditing.bind(this)}>
          Edit
        </button>
      </div>
    )}
  }

  handleDelete() {
    request.delete(`/api/people/${this.props.params.id}`).end((err) => {
      if (err) {
        return alert(`Something went wrong!\n\n${err.stack}`);
      }
      alert('Successfully deleted!');
      window.location = '/people';
    });
  }

  render() {
    const person = this.state.person;
    if (!person) {
      return <NotFoundPage/>;
    }
    const headerStyle = { backgroundImage: `url(/img/${person.cover})` };
    return (
      <div className="person">
        <header style={headerStyle}/>
        <div className="picture-container">
            <img className="logo" src="/img/person-face.png"/>
            {/* <img src={`/img/${person.image}`}/> */}
            { this.renderItemOrEditField( this.state ) }
        </div>
        <button className="delete-button" onClick={this.handleDelete}>Destroy Contestant</button>
        <div className="navigateBack">
          <Link to="/">« Back to the Future</Link>
        </div>
      </div>
    );
  }
}
