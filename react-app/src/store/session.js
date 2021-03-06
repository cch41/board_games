// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

const SET_SUDOKU_SCORE = "session/SET_SUDOKU_SCORE";
const SET_GAME_OF_LIFE_SCORE = "session/SET_GAME_OF_LIFE_SCORE";
const SET_CHESS_SCORE = "session/SET_CHESS_SCORE";
const SET_GO_SCORE = "session/SET_GO_SCORE";

// action creators
const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});
const removeUser = () => ({ type: REMOVE_USER });

const setSudokuScore = (user) => ({ type: SET_SUDOKU_SCORE, payload: user });
const setGameOfLifeScore = (user) => ({
	type: SET_GAME_OF_LIFE_SCORE,
	payload: user,
});
const setChessScore = (user) => ({ type: SET_CHESS_SCORE, payload: user });
const setGoScore = (user) => ({ type: SET_GO_SCORE, payload: user });

// thunks

export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await response.json();
	if (data.errors) {
		return;
	}
	dispatch(setUser(data));
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});
	const data = await response.json();
	if (data.errors) {
		console.log(data);
		return data;
	}
	dispatch(setUser(data));
	return {};
};

export const logout = () => async (dispatch) => {
	await fetch("/api/auth/logout/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	dispatch(removeUser());
};

export const signUp =
	(username, email, password, method, id = null) =>
	async (dispatch) => {
		const response = await fetch("/api/auth/signup/", {
			method: method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
				username,
				email,
				password,
			}),
		});
		const data = await response.json();
		if (data.errors) {
			return data;
		}
		dispatch(setUser(data));
		return {};
	};

export const updateUserScore = (userId, game, points) => async (dispatch) => {
	const response = await fetch(`/api/users/${userId}/games/${game}/`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			points,
		}),
	});
	const data = await response.json();
	if (data.errors) {
		return data;
	}
	if (game === "sudoku") dispatch(setSudokuScore(data));
	else if (game === "game_of_life") dispatch(setGameOfLifeScore(data));
	else if (game === "chess") dispatch(setChessScore(data));
	else if (game === "go") dispatch(setGoScore(data));
};

export const deleteUser = (userId) => async (dispatch) => {
	await fetch(`/api/auth/${userId}/`, { method: "DELETE" });
	dispatch(removeUser());
};

const initialState = { user: null };

export default function reducer(state = initialState, action) {
	let newState;
	switch (action.type) {
		case SET_USER:
			return { user: action.payload };
		case REMOVE_USER:
			return { user: null };
		case SET_SUDOKU_SCORE:
			newState = Object.assign({}, state);
			newState.user.sudoku_score = action.payload.sudoku_score;
			return newState;
		case SET_GAME_OF_LIFE_SCORE:
			newState = Object.assign({}, state);
			newState.user.game_of_life_score =
				action.payload.game_of_life_score;
			return newState;
		case SET_CHESS_SCORE:
			newState = Object.assign({}, state);
			newState.user.chess_score = action.payload.chess_score;
			return newState;
		case SET_GO_SCORE:
			newState = Object.assign({}, state);
			newState.user.go_score = action.payload.go_score;
			return newState;
		default:
			return state;
	}
}
