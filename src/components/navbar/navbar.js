import React from 'react';

export const Navbar = props => (
  <div className="navbar-container">
    <button
      className="navbar-home-button"
      onClick={() => {
        props.navToHome();
      }}
    >
			Home
    </button>
    <button
      className="navbar-saved-button"
      onClick={() => {
        props.navToSaved();
      }}
    >
			Saved Properties
    </button>
  </div>
);

export default Navbar;
