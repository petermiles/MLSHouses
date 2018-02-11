import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import toMaterialStyle from 'material-color-hash';
import { TransitionGroup } from 'react-transition-group';
import firestore from 'fire'; // eslint-disable-line
import Results from 'components/results/results'; // eslint-disable-line
import gsap from 'gsap/animations'; // eslint-disable-line
import './saved.css';

export default class Saved extends Component {
  constructor(props) {
    super(props);
    this.state = { listings: [], loading: true, error: false };

    this.savedRefs = [];
  }
  componentDidMount() {
    firestore
      .collection('users')
      .doc(`${this.props.uid}`)
      .collection('savedList')
      .get()
      .then((result) => {
        const arr = [];
        result.forEach((doc) => {
          arr.push(doc.data());
        });
        this.setState({ listings: arr, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  }

  componentWillAppear(cb) {
    if (this.savedRefs.length) {
      gsap.showResults(this.savedRefs, cb, this.props.index);
    }
  }

  componentWillLeave(cb) {
    gsap.hideResults(this.savedRefs, cb, this.props.index);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-wrapper">
          <span role="img" aria-label="Error Loading Properties">
            😔
          </span>
          <h3>
            Sorry!<br />There was an error loading your saved properties
          </h3>
        </div>
      );
    }

    return this.state.loading ? null : (
      <div className="saved-wrapper">
        {this.state.listings.length ? (
          this.state.listings.map((listing, i) => (
            <TransitionGroup className="saved-dimensions" key={i}>
              <Results
                saved
                index={i}
                color={toMaterialStyle(listing.id)}
                {...listing}
                selectProperty={this.props.selectProperty}
                storeRef={(ref) => {
                  this.savedRefs.push(ref);
                }}
              />
            </TransitionGroup>
          ))
        ) : (
          <div className="no-saved-listings">
            <h1>{"You don't have any saved listings"}</h1>
          </div>
        )}
      </div>
    );
  }
}

Saved.propTypes = {
  uid: PropTypes.string.isRequired,
  selectProperty: PropTypes.func.isRequired,
};
