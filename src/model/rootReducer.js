import reducerUser from "./reducerUser";
import {combineReducers} from 'redux';
import reducerSPV from "./reducerSPV";
import reducerASM from "./reducerASM";

const rootReducer = combineReducers({
    user: reducerUser,
    spv: reducerSPV,
    asm: reducerASM 
})

export default rootReducer