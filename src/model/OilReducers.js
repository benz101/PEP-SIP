import { 
    GET_OIL_REQUEST, 
    GET_OIL_SUCCESS, 
    GET_OIL_FAILURE 
} from '../constants';

const initialState = {
    data: {},
    isLoading: false,
    isLoggedIn: false
}

export default OilReducers = ( state = initialState, action) => {
    switch(action.type) {
        case GET_OIL_REQUEST:
        return {
            ...state,
            isLoading: true,
            isLoggedIn: false,
        }
        case GET_OIL_SUCCESS:
        return {
            ...state,
            isLoading: false,
            isLoggedIn: true,
            data: action.payload
        }
        case GET_OIL_FAILURE:
        return {
            ...state,
            isLoading: false,
            isLoggedIn: false
        }
        default:
        return state;
    }
}