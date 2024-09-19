import { 
    Dimensions
} from "react-native";


const dim_width = Dimensions.get('window').width;
const dim_height = Dimensions.get('window').height;

export const width = dim_width < dim_height ? dim_width : dim_height;
export const height = dim_height > dim_width ? dim_height : dim_width;


const configUrl = {
    http: "https://epsvrhofdev04/apisot1/svc_execScript2",
    https: "https://sot.pep.pertamina.com/api/svc_execScript2",
    https2: "https://sot.pep.pertamina.com/apisot1/svc_execScript2"
}

export default configUrl