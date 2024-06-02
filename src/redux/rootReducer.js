import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import socketReducer from './slices/socketSlice';

const rootPersistConfig = {
	key: 'root',
	storage,
	keyPrefix: 'redux-',
	whitelist: [],
	blacklist: ['socket'],
};

const rootReducer = combineReducers({
	socket: socketReducer,
});

export { rootPersistConfig, rootReducer };