"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _app = _interopRequireDefault(require("firebase/app"));

require("firebase/database");

require("firebase/auth");

var _redux = require("redux");

var _reduxDevtoolsExtension = require("redux-devtools-extension");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//////////////////////// REDUX ////////////////////////
var initialState = {};
var ROOT_PAYLOAD_UPSERT = "ROOT_PAYLOAD_UPSERT";

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ROOT_PAYLOAD_UPSERT:
      return _objectSpread(_objectSpread({}, state), action.payload);

    default:
      return state;
  }
};

var initializeStore = function initializeStore() {
  var preloadedState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return (0, _redux.createStore)(reducers ? (0, _redux.combineReducers)(reducers) : reducer, preloadedState, (0, _reduxDevtoolsExtension.composeWithDevTools)((0, _redux.applyMiddleware)()));
}; ////////////////////// FIREBASE //////////////////////


var firebaseIsInitialized = function firebaseIsInitialized() {
  return _app["default"].apps.length > 0;
};

var initializeApp = function initializeApp() {
  return _app["default"].initializeApp({
    apiKey: "AIzaSyDO00jPn7EO2lMe0vBP-qvs0qidB_sB1SQ",
    authDomain: "ritual-recipes.firebaseapp.com",
    databaseURL: "https://ritual-recipes.firebaseio.com",
    projectId: "ritual-recipes",
    storageBucket: "ritual-recipes.appspot.com",
    messagingSenderId: "847696364267",
    appId: "1:847696364267:web:fd07be386619c426caf4ae",
    measurementId: "G-S938KKHZJY"
  });
};

var signInAnonymously = function signInAnonymously() {
  return _app["default"].auth().signInAnonymously();
};

var onAuthStateChanged = function onAuthStateChanged(cb) {
  return _app["default"].auth().onAuthStateChanged(cb);
};

var onValue = function onValue(path, cb) {
  return _app["default"].database().ref(path).on("value", function (snap) {
    return cb(snap.val());
  });
};

var updateFirebase = function updateFirebase(path, dataObj) {
  return _app["default"].database().ref(path).update(dataObj);
}; //////////////////// withFirebird ////////////////////


var _default = function _default(PageComponent) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$ssr = _ref.ssr,
      ssr = _ref$ssr === void 0 ? true : _ref$ssr,
      _ref$auth = _ref.auth,
      auth = _ref$auth === void 0 ? null : _ref$auth;

  var WithFirebird = function WithFirebird(_ref2) {
    var initialReduxState = _ref2.initialReduxState,
        props = _objectWithoutProperties(_ref2, ["initialReduxState"]);

    var store = getOrInitializeStore(initialReduxState);
    return /*#__PURE__*/_react["default"].createElement(_reactRedux.Provider, {
      store: store
    }, /*#__PURE__*/_react["default"].createElement(PageComponent, props));
  }; // Set the correct displayName in development


  if (process.env.NODE_ENV !== "production") {
    var displayName = PageComponent.displayName || PageComponent.name || "Component";
    WithFirebird.displayName = "withFirebird(".concat(displayName, ")");
  }

  if (ssr || PageComponent.getInitialProps) {
    WithFirebird.getInitialProps = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(context) {
        var reduxStore, pageProps;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Get or Create the store with `undefined` as initialState
                // This allows you to set a custom default initialState
                reduxStore = getOrInitializeStore(); // Provide the store to getInitialProps of pages

                context.reduxStore = reduxStore; // Run getInitialProps from HOCed PageComponent

                if (!(typeof PageComponent.getInitialProps === "function")) {
                  _context.next = 8;
                  break;
                }

                _context.next = 5;
                return PageComponent.getInitialProps(context);

              case 5:
                _context.t0 = _context.sent;
                _context.next = 9;
                break;

              case 8:
                _context.t0 = {};

              case 9:
                pageProps = _context.t0;
                return _context.abrupt("return", _objectSpread(_objectSpread({}, pageProps), {}, {
                  initialReduxState: reduxStore.getState()
                }));

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }();
  }

  if (!firebaseIsInitialized()) {
    initializeApp();

    if (auth) {
      var userPath = auth.userPath || "users";
      onAuthStateChanged(function (user) {
        if (user) {
          onUid = user.uid;
          onValue("".concat(userPath, "/").concat(user.uid), function (user) {
            reduxStore.dispatch({
              type: ROOT_PAYLOAD_UPSERT,
              payload: {
                user: user
              }
            });
          });
          updateFirebase("".concat(userPath, "/").concat(user.uid), Object.entries(user).reduce(function (prev, entry) {
            if (typeof entry[1] === "string") prev[entry[0]] = entry[1];
            return prev;
          }, {}));
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

exports["default"] = _default;
var reduxStore;

var getOrInitializeStore = function getOrInitializeStore(initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === "undefined") {
    return initializeStore(initialState);
  } // Create store if unavailable on the client and set it on the window object


  if (!reduxStore) {
    reduxStore = initializeStore(initialState);
  }

  return reduxStore;
};
