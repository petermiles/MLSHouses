const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors');
const { json } = require('body-parser');
const express = require('express');
const moment = require('moment');

const app = express();

app.use(cors());
app.use(json());

app.get('/api/get/MLSlisting', (req, res) => {
	axios
		.get('https://api.simplyrets.com/openhouses', {
			auth: {
				username: 'simplyrets',
				password: 'simplyrets',
			},
		})
		.then(result => {
			// the following function just parses out the data that I actually need to display to the user
			return res.json(
				result.data.reduce((acc, curr, ind) => {
					acc.push({
						id: curr.openHouseId,
						mlsId: curr.listing.mlsId,
						address: {
							full: curr.listing.address.full,
							postalInfo: `${curr.listing.address.city} , ${
								curr.listing.address.state
							} ${curr.listing.address.postalCode}`,
						},
						geo: {
							lat: curr.listing.geo.lat,
							lng: curr.listing.geo.lng,
						},
						listDate: moment(curr.listing.listDate).format('MM/DD/YYYY'),
						listPrice: curr.listing.listPrice.toLocaleString(),
						photo: curr.listing.photos[0],
						beds: curr.listing.property.bedrooms,
						fullBaths: curr.listing.property.bathsFull,
						halfBaths: curr.listing.property.bathsHalf,
						stories: curr.listing.property.stories,
					});
					return acc;
				}, [])
			);
		})
		.catch(console.log);
});

exports.listings = functions.https.onRequest(app);
