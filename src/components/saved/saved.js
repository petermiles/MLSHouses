import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import toMaterialStyle from 'material-color-hash';
import firestore from '../../fire';
import Results from '../results/results';
import './saved.css';

export default class Saved extends Component {
  constructor(props) {
    super(props);
    this.state = { listings: '', loading: true };

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
        this.setState({ listings: arr, loading: false }, () => {
          console.log(arr);
        });
      })
      .catch(console.log);
  }
  render() {
    return this.state.loading ? null : (
      <div className="saved-wrapper">
        {this.state.listings ? (
          this.state.listings.map((listing, i) => (
            <Results
              index={i}
              key={listing.id}
              color={toMaterialStyle(listing.id)}
              {...listing}
              selectProperty={this.props.selectProperty}
              storeRef={(ref) => {
                this.savedRefs.push(ref);
              }}
            />
          ))
        ) : (
          <h1>You don't have any saved listings.</h1>
        )}
      </div>
    );
  }
}

Saved.propTypes = {
  uid: PropTypes.string.isRequired,
  selectProperty: PropTypes.func.isRequired,
};
