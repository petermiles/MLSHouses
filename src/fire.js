import firebase from 'firebase';

require('firebase/firestore');

const config = {
  apiKey: 'AIzaSyBtBTfqTm1opklyxJ9ogweme7F8kXyeXk8',
  authDomain: 'reside-e74b6.firebaseapp.com',
  databaseURL: 'https://reside-e74b6.firebaseio.com',
  projectId: 'reside-e74b6',
  storageBucket: 'reside-e74b6.appspot.com',
  messagingSenderId: '758368004577',
};

// const firebase = fire.initializeApp(config).firestore();
const firestore = firebase.initializeApp(config).firestore();
export default firestore;
