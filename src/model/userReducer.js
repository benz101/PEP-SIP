import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE
} from '../constants';

const initialState = {
    data: [],
    isLoading: false,
    isLoggedIn: false,
    username: '',
    userpass: '',
    corporate_id: ''
}

export default userReducer = ( state = initialState, action) => {
    switch(action.type) {
        case LOGIN_REQUEST:
        return {
            ...state,
            isLoading: true,
            isLoggedIn: false,
        }
        case LOGIN_SUCCESS:
        return {
            ...state,
            isLoading: false,
            isLoggedIn: true,
            data: action.payload
        }
        case LOGIN_FAILURE:
        return {
            ...state,
            isLoading: false,
            isLoggedIn: false
        }
        default:
        return state;
    }
}