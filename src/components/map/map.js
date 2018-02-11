import React from 'react';
import { PropTypes } from 'prop-types';

import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
} from 'react-google-maps';

const Map = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: props.geo.lat, lng: props.geo.lng }}
    >
      <Marker position={{ lat: props.geo.lat, lng: props.geo.lng }} />
    </GoogleMap>
  )),
);

export default Map;

Map.propTypes = {
  geo: PropTypes.object.isRequired,
};
