export const initialState = {
    params: null,
    error: null
};
const reducerSPV = (state = initialState, action) => {
    const newState = { ...state }

    switch (action.type) {
          case 'SPV_SUCCESS':
                newState.params = action.valueSPV
                break;
          case 'SPV_ERROR':
                newState.error = action.valueError
                break;
    }

    return newState
};

export default reducerSPV;