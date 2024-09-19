export const initialState = {
    params: null,
    error: null
};
const reducerFM = (state = initialState, action) => {
    const newState = { ...state }

    switch (action.type) {
          case 'FM_SUCCESS':
                newState.params = action.valueFM
                break;
          case 'FM_ERROR':
                newState.error = action.valueError
                break;
    }

    return newState
};

export default reducerFM;