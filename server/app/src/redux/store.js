import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";

const composeEnhancers = 
	process.env.NODE_ENV !== "production" &&
	typeof window === 'object' &&
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
		: compose;

const configureStore = () => 
	createStore(
		rootReducer,
		composeEnhancers(applyMiddleware(thunk))
	);

const store = configureStore({});

export default store;