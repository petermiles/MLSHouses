import React, { Component } from 'react';
import axios from 'axios';
import toMaterialStyle from 'material-color-hash';
import { TransitionGroup } from 'react-transition-group';
import './App.css';
import gsap from './gsap/animations';
import Results from './components/results/results';
import Property from './components/property/property';
import Saved from './components/saved/saved';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showSaved: false,
      listings: '',
      selected: '',
      uid: Math.random() * 10000000,
      // this is the random userid.
    };
    this.listingsRefs = [];
    this.propertyRef = [];
    this.savedRef = '';
    this.selectProperty = this.selectProperty.bind(this);
  }

  componentDidMount() {
    // I've decided to set up a cloud function for this API call. Consindering the amount of data that I will be presenting is limited, I don't want to subject users to unnecessary data. By parsing out the values that I actually need from the API call in my cloud function, I am able to cut down the data received from the API by 55% ( 10.4KB => 4.6KB) . This might have been overkill, but I am a strong believer in only using resources that are absolutely necessary.
    axios
      .get('https://us-central1-reside-e74b6.cloudfunctions.net/listings/api/get/MLSlisting')
      .then(
        (result) => {
          this.setState({ listings: result.data, loading: false });
        },
        () => {
          if (!localStorage.getItem('uid')) {
            localStorage.setItem('uid', this.state.uid);
          }
        },
      );
  }
  selectProperty(id) {
    console.log(this.listingsRefs);
    gsap.hideResults(this.listingsRefs, null, 0.25);

    setTimeout(() => {
      this.setState({ selected: this.state.listings.find(x => x.id === id) });
      // time*1000
    }, 450);
  }

  render() {
    const {
      loading, uid, selected, showSaved,
    } = this.state;
    return loading ? null : (
      <div className="App">
        <div className="navbar-container">
          <h3>Peter Miles</h3>
          <button
            className="navbar-saved-button"
            onClick={() => {
              this.setState({ showSaved: !this.state.showSaved });
            }}
          >
            {this.state.showSaved ? 'Home' : 'Saved Properties'}
          </button>
        </div>

        {showSaved ? (
          <div className="saved-container">
            <Saved
              uid={uid}
              selectProperty={this.selectProperty}
              storeRef={(ref) => {
                this.savedRefs.push(ref);
              }}
            />
          </div>
        ) : selected ? (
          <TransitionGroup className="property-container">
            <Property
              uid={uid}
              color={toMaterialStyle(selected.id)}
              selected={selected}
              navHomeScreen={() => {
                this.setState({ selected: '' });
              }}
            />
          </TransitionGroup>
        ) : (
          <div className="results-container">
            {this.state.listings.map((listing, i) => (
              <TransitionGroup className="result-wrapper" key={listing.id}>
                <Results
                  index={i}
                  openHouseId={listing.id}
                  color={toMaterialStyle(listing.id)}
                  selectProperty={this.selectProperty}
                  storeRef={(ref) => {
                    this.listingsRefs.push(ref);
                  }}
                  {...listing}
                />
              </TransitionGroup>
            ))}
          </div>
        )}
      </div>
    );
  }
}
