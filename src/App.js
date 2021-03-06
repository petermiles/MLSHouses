import React, { Component } from 'react';
import axios from 'axios';
import toMaterialStyle from 'material-color-hash';
import { TransitionGroup } from 'react-transition-group';
import './App.css';
import gsap from './gsap/animations';
import Results from './components/results/results';
import Property from './components/property/property';
import Saved from './components/saved/saved';
import Navbar from './components/navbar/navbar';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showSaved: false,
      listings: '',
      selected: '',
      uid: '',
    };
    this.propertyRef = [];
    this.listingsRefs = [];
    this.savedRefs = [];
    this.selectProperty = this.selectProperty.bind(this);
  }

  componentDidMount() {
    // I've decided to set up a cloud function for this API call. Consindering the amount of data that I will be presenting is limited, I don't want to subject users to unnecessary data. By parsing out the values that I actually need from the API call in my cloud function, I am able to cut down the data received from the API by 55% ( 10.4KB => 4.6KB) . This might have been overkill, but I am a strong believer in only using resources that are absolutely necessary.
    axios
      .get(
        'https://us-central1-reside-e74b6.cloudfunctions.net/listings/api/get/MLSlisting',
      )
      .then((result) => {
        if (!localStorage.getItem('uid')) {
          localStorage.setItem('uid', Math.random() * 100000);
        }
        // This checks to see if there a user ID saved in the local storage. If there isn't, it will create a random number for the user ID.
        this.setState({
          listings: result.data,
          loading: false,
          uid: localStorage.getItem('uid'),
          // Saves the uid to state for use everywhere else.
        });
      });
  }
  selectProperty(id) {
    gsap.hideResults(
      this.listingsRefs,
      this.setState({ selected: this.state.listings.find(x => x.id === id) }),
      0.25,
    );
    // this will trigger the Results component to hide, and the Property component to show. This also will search through the listings and pick the appreiate listing given an ID.

    // This also will fire a GSAP function that will hide the results page. Make it look pretty.
  }

  render() {
    const { loading, uid, selected, showSaved } = this.state;
    return loading ? null : (
      <div className="App">
        <div className="navbar-container">
          <Navbar
            navToSaved={() => this.setState({ showSaved: true, selected: '' })}
            navToHome={() => this.setState({ showSaved: false, selected: '' })}
          />
        </div>
        {/* In reality, I shouldn't have done a nested ternary. This would have been much simpler to do had I used router, but I wanted to keep everything small and simple enough. */}
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
            />
          </TransitionGroup>
        ) : (
          <div className="results-container">
            {this.state.listings.map((listing, i) => (
              <TransitionGroup className="result-wrapper" key={listing.id}>
                <Results
                  saved={false}
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
