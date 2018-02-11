import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firestore from '../../fire';
import gsap from '../../gsap/animations';

import Map from '../map/map';
import './property.css';

export default class Property extends Component {
  constructor() {
    super();
    this.state = { saved: false };

    this.imageRef = [];
    this.infoRef = [];

    this.saveProperty = this.saveProperty.bind(this);
  }

  componentWillEnter(cb) {
    gsap.show([this.infoRef], cb, 0);
  }

  componentWillAppear() {
    const imageLoading = new Promise((resolve) => {
      this.imageRef[0].onload = () => {
        resolve();
      };
    });

    return Promise.all([imageLoading]).then(() => {
      gsap.showProperty(this.infoRef, null);
    });

    // This just handles image loading. I attached onload to the image ref and when the image has been succesfully loaded, then I'll trigger the gsap function to show the necessary data.
  }

  saveProperty() {
    const savedListRef = firestore
      .collection('users')
      .doc(`${this.props.uid}`)
      .collection('savedList');
    savedListRef.get().then((result) => {
      let saved = false;
      result.forEach((doc) => {
        saved = doc.data().mlsId === this.props.selected.mlsId;
      });
      if (saved) {
        this.setState({ alreadySaved: true });
      } else {
        savedListRef
          .doc()
          .set({
            ...this.props.selected,
          })
          .then(() => {
            this.setState({ saved: true });
          });
      }
    });

    /*
    This is the function responsible for saving data to Firestore. I first do a check to see if that property has already been saved and if it has, then it will show an already-saved button. If the user hasn't saved it, it will save it to Firestore.

    Had I used firebase authentication, I could've use cloud functions to do a check to make sure that the value hadn't already been saved.

    A collection named users that will house documents associated with each user. Within each user document, I have a collection named savedList that will house their saved information. Then each individual saved property will have it's own document with the necessary information.
    */
  }

  render() {
    const {
      halfBaths,
      fullBaths,
      beds,
      address,
      listPrice,
      listDate,
      mlsId,
      geo,
      photo,
      stories,
    } = this.props.selected;
    return (
      <div className="property-wrapper" ref={ref => this.infoRef.push(ref)}>
        <div className="property-image-container">
          <img
            ref={ref => this.imageRef.push(ref)}
            src={photo}
            alt={address.full}
            className="image"
          />
        </div>

        <div className="property-info-wrapper">
          <div
            className="property-info-header"
            style={{
              backgroundColor: this.props.color.backgroundColor,
              color: this.props.color.color,
            }}
          >
            <p className="property-address">{address.full}</p>
            <p className="property-address">{address.postalInfo}</p>
          </div>
          <div className="property-meta-data">
            <p className="property-mslid">
              MLSID <br /> {mlsId}
            </p>
            <p className="property-list-date">
              List Date <br /> {listDate}
            </p>
          </div>
          <div className="property-specs-wrapper">
            <div className="property-specs">
              <div className="property-icons">
                <span className="property-info-piece">
                  <span
                    role="img"
                    aria-label="Beds"
                    className="property-info-icon"
                  >
                    🛏
                  </span>
                  <p>
                    {beds}
                    {beds > 1 ? ' Bedrooms' : ' Bedroom'}
                  </p>
                </span>
                <span className="property-info-piece">
                  <span
                    role="img"
                    aria-label="Full Bath"
                    className="property-info-icon"
                  >
                    🛁
                  </span>
                  <p>
                    {fullBaths} {fullBaths > 1 ? ' Bath' : ' Baths'}
                  </p>
                </span>
                <span className="property-info-piece">
                  <span
                    role="img"
                    aria-label="Half Bath"
                    className="property-info-icon"
                  >
                    🚽
                  </span>
                  <p>
                    {halfBaths}
                    {halfBaths > 1 ? ' Half Bath' : ' Half Baths'}
                  </p>
                </span>

                <span className="property-info-piece">
                  <span
                    role="img"
                    aria-label="Stories"
                    className="property-info-icon"
                  >
                    🏠
                  </span>
                  <p>
                    {stories} {stories > 1 ? ' Stories' : ' Story'}
                  </p>
                </span>
              </div>
              <div className="property-price">
                <h1>${listPrice.toLocaleString()}</h1>
              </div>
            </div>
          </div>

          <div className="property-footer">
            {this.state.alreadySaved ? (
              <button className="save-button"> Already Saved </button>
  ) : (
    <button className="save-button" onClick={this.saveProperty}>
      {!this.state.saved ? <p>Save Property</p> : <p> Saved </p>}
    </button>
  )}
          </div>;
        </div>

        <div className="map-container">
          <Map
            geo={geo}
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
            storeMapRef={ref => this.mapRef.push(ref)}
            loadingElement={<div style={{ height: '100%' }} />}
            containerElement={<div style={{ height: '100%' }} />}
            mapElement={<div style={{ height: '100%' }} />}
          />
        </div>
      </div>
    );
  }
}

Property.propTypes = {
  uid: PropTypes.number.isRequired,
  color: PropTypes.object.isRequired,
  selected: PropTypes.shape({
    mlsId: PropTypes.number.isRequired,
    halfBaths: PropTypes.number.isRequired,
    fullBaths: PropTypes.number.isRequired,
    beds: PropTypes.number.isRequired,
    listPrice: PropTypes.string.isRequired,
    listDate: PropTypes.string.isRequired,
    address: PropTypes.object.isRequired,
    photo: PropTypes.string.isRequired,
    geo: PropTypes.object.isRequired,
    stories: PropTypes.number.isRequired,
  }).isRequired,
};
