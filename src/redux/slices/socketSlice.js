import { createSlice } from '@reduxjs/toolkit';
import { connectSocket } from '../../socket';

const socketSlice = createSlice({
	name: 'socket',
	initialState: {
		instance: null,
	},
	reducers: {
		setSocket: (state, action) => {
			state.instance = action.payload;
		},
	},
});

export const { setSocket } = socketSlice.actions;

export const initializeSocket = () => (dispatch) => {
	const socket = connectSocket();
	dispatch(setSocket(socket));
};

export const selectSocket = (state) => state.socket?.instance;

export default socketSlice.reducer;