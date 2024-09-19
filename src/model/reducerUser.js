export const initialState = {
    params: null,
    error: null
};
const reducerLogin = (state = initialState, action) => {
    const newState = { ...state }

    switch (action.type) {
          case 'USER_SUCCESS':
                newState.params = action.valueUser
                break;
          case 'USER_ERROR':
                newState.error = action.valueError
                break;
    }

    return newState
};

export default reducerLogin