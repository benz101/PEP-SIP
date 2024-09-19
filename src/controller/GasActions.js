import { NavigationActions } from 'react-navigation';
import { 
    GET_GAS_REQUEST, 
    GET_GAS_SUCCESS, 
    GET_GAS_FAILURE 
} from '../constants';

export const getOilProduction = () => {
    return (dispatch) => {
        dispatch({ type: GET_GAS_REQUEST });
        fetch('https://sot.pep.pertamina.com/api/svc_execScript2', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                script_name: "api/v2/api_gas_production"
            })
        }).then(res => res.json())
        .then(json => {
            dispatch({ type: GET_GAS_SUCCESS, payload: json.data })
        })
        .catch(err => {
            dispatch({ type: GET_GAS_FAILURE, payload : err.message || err })
        })
    }
}