import {
    GET_GAS_REQUEST, 
    GET_GAS_SUCCESS, 
    GET_GAS_FAILURE 
} from '../constants';

const initialState = {
    data: [],
    isLoading: false,
    isLoggedIn: false
}

export default GasReducers = ( state = initialState, action) => {
    switch(action.type) {
        case GET_GAS_REQUEST:
        return {
            ...state,
            isLoading: true,
            isLoggedIn: false,
        }
        case GET_GAS_SUCCESS:
        return {
            ...state,
            isLoading: false,
            isLoggedIn: true,
            data: action.payload
        }
        case GET_GAS_FAILURE:
        return {
            ...state,
            isLoading: false,
            isLoggedIn: false
        }
        default:
        return state;
    }
}