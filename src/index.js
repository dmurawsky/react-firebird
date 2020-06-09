import React from "react";
import { Provider } from "react-redux";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

//////////////////////// REDUX ////////////////////////

const initialState = {};

const ROOT_PAYLOAD_UPSERT = "ROOT_PAYLOAD_UPSERT";

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ROOT_PAYLOAD_UPSERT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const initializeStore = (preloadedState = initialState, reducers = null) => {
  return createStore(
    reducers ? combineReducers(reducers) : reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  );
};

////////////////////// FIREBASE //////////////////////

const firebaseIsInitialized = () => firebase.apps.length > 0;

const initializeApp = () =>
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

const signInAnonymously = () => firebase.auth().signInAnonymously();

const onAuthStateChanged = (cb) => firebase.auth().onAuthStateChanged(cb);

const onValue = (path, cb) =>
  firebase
    .database()
    .ref(path)
    .on("value", (snap) => cb(snap.val()));

const updateFirebase = (path, dataObj) =>
  firebase.database().ref(path).update(dataObj);

//////////////////// withFirebird ////////////////////

export default (PageComponent, { ssr = true, auth = null } = {}) => {
  const WithFirebird = ({ initialReduxState, ...props }) => {
    const store = getOrInitializeStore(initialReduxState);
    return (
      <Provider store={store}>
        <PageComponent {...props} />
      </Provider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";

    WithFirebird.displayName = `withFirebird(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithFirebird.getInitialProps = async (context) => {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrInitializeStore();

      // Provide the store to getInitialProps of pages
      context.reduxStore = reduxStore;

      // Run getInitialProps from HOCed PageComponent
      const pageProps =
        typeof PageComponent.getInitialProps === "function"
          ? await PageComponent.getInitialProps(context)
          : {};

      // Pass props to PageComponent
      return {
        ...pageProps,
        initialReduxState: reduxStore.getState(),
      };
    };
  }

  if (!firebaseIsInitialized()) {
    initializeApp();
    if (auth) {
      const userPath = auth.userPath || "users";
      onAuthStateChanged((user) => {
        if (user) {
          onUid = user.uid;
          onValue(`${userPath}/${user.uid}`, (user) => {
            reduxStore.dispatch({
              type: ROOT_PAYLOAD_UPSERT,
              payload: { user },
            });
          });
          updateFirebase(
            `${userPath}/${user.uid}`,
            Object.entries(user).reduce((prev, entry) => {
              if (typeof entry[1] === "string") prev[entry[0]] = entry[1];
              return prev;
            }, {})
          );
        } else {
          if (onUid) {
            window.location.href = "/";
          }
        }
      });
    }
    if (auth && auth.anonymous) {
      signInAnonymously();
    }
  }

  return WithFirebird;
};

let reduxStore;
const getOrInitializeStore = (initialState) => {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === "undefined") {
    return initializeStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!reduxStore) {
    reduxStore = initializeStore(initialState);
  }

  return reduxStore;
};
