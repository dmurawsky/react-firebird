import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

export const firebaseIsInitialized = () => firebase.apps.length > 0;

export const initializeApp = () =>
  firebase.initializeApp({
    apiKey: "AIzaSyDO00jPn7EO2lMe0vBP-qvs0qidB_sB1SQ",
    authDomain: "ritual-recipes.firebaseapp.com",
    databaseURL: "https://ritual-recipes.firebaseio.com",
    projectId: "ritual-recipes",
    storageBucket: "ritual-recipes.appspot.com",
    messagingSenderId: "847696364267",
    appId: "1:847696364267:web:fd07be386619c426caf4ae",
    measurementId: "G-S938KKHZJY",
  });

export const signInAnonymously = () => firebase.auth().signInAnonymously();

export const onAuthStateChanged = (cb) =>
  firebase.auth().onAuthStateChanged(cb);

export const onValue = (path, cb) =>
  firebase
    .database()
    .ref(path)
    .on("value", (snap) => cb(snap.val()));

export const updateFirebase = (path, dataObj) =>
  firebase.database().ref(path).update(dataObj);
