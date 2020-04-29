import { AUTHENTICATE, LOGOUT } from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  displayName: null,
  expirationTime: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        displayName: action.displayName,
        expirationTime: action.expirationTime,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
