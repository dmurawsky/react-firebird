import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {};

export const ROOT_PAYLOAD_UPSERT = "ROOT_PAYLOAD_UPSERT";

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ROOT_PAYLOAD_UPSERT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const initializeStore = (
  preloadedState = initialState,
  reducers = null,
  middleware
) => {
  return createStore(
    reducers ? reducer : combineReducers(reducers),
    preloadedState,
    composeWithDevTools(applyMiddleware(middleware))
  );
};
