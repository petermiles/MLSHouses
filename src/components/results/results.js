import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import gsap from '../../gsap/animations';
import './results.css';

export default class Results extends Component {
  componentDidMount() {
    this.props.storeRef(this.item);
  }

  componentWillAppear(cb) {
    gsap.showResults(this.item, cb, this.props.index);
  }

  componentWillLeave(cb) {
    gsap.hideResults(this.item, cb, this.props.index);
  }

  render() {
    const {
      id,
      halfBaths,
      fullBaths,
      beds,
      address,
      listPrice,
      selectProperty,
    } = this.props;

    return (
      <div
        ref={ref => (this.item = ref)}
        className={this.props.saved ? 'saved-results' : 'result-box-shadow'}
        onClick={() => {
          if (id) {
            selectProperty(id);
          }
        }}
      >
        <div className="result-container">
          <div
            className="header"
            style={{
              backgroundColor: this.props.color.backgroundColor,
              color: this.props.color.color,
            }}
          >
            <p className="main-address">{address.full}</p>
            <p className="city-state">{address.postalInfo}</p>
          </div>
          <div className="info">
            <span className="icon-info">
              <span role="img" aria-label="Baths" className="bed-bath-icon">
                🛁
              </span>
              <p>
                {fullBaths + halfBaths * 0.5}
                {fullBaths + halfBaths * 0.5 > 1 ? ' Baths' : ' Bath'}
              </p>
            </span>
            <span className="icon-info">
              <span role="img" aria-label="Beds" className="bed-bath-icon">
                🛏
              </span>
              <p>
                {beds}
                {beds > 1 ? ' Bedrooms' : ' Bedroom'}
              </p>
            </span>
          </div>
          <div className="price">
            <p>${listPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }
}

Results.propTypes = {
  color: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  halfBaths: PropTypes.number.isRequired,
  fullBaths: PropTypes.number.isRequired,
  beds: PropTypes.number.isRequired,
  listPrice: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  selectProperty: PropTypes.func.isRequired,
  storeRef: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

// address
// stories
// bedrooms
// baths full
// baths half
// mlsld
// list date MM/DD/YYYY
// a photo
// list price
