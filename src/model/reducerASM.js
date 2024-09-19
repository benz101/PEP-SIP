export const initialState = {
    params: null,
    error: null
};
const reducerASM = (state = initialState, action) => {
    const newState = { ...state }

    switch (action.type) {
          case 'ASM_SUCCESS':
                newState.params = action.valueASM
                break;
          case 'ASM_ERROR':
                newState.error = action.valueError
                break;
    }

    return newState
};

export default reducerASM;