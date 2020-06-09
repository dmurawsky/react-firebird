import React from "react";
import { Provider } from "react-redux";
import { initializeStore } from "../redux";
import {
  firebaseIsInitialized,
  initializeApp,
  onAuthStateChanged,
  signInAnonymously,
} from "./firebase";
import { ROOT_PAYLOAD_UPSERT } from "./redux";

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
    if (auth.anonymous) {
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
