import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
    apiKey: "AIzaSyA2Pi3m3IGxUHUicF6rdECpHUk2cBje_3c",
    authDomain: "https://lottary-amit-77608.firebaseapp.com/",
    databaseURL: "https://lottary-amit-77608.firebaseapp.com/",
    projectId: "lottary-amit-77608"
}

firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser


// firebase collections
const usersCollection = db.collection('user');
const walletCollection = db.collection('wallet');
const orderCollection = db.collection('order');
const providerCollection = db.collection('provider');
const timeCollection = db.collection('time');
const resultCollection = db.collection('result');


export {
    db,
    auth,
    currentUser,
    usersCollection,
    walletCollection,
    orderCollection,
    providerCollection,
    timeCollection,
    resultCollection
}