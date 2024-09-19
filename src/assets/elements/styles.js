import {
    StyleSheet,
    Dimensions
} from "react-native";
import { normalize } from "react-native-elements";


const dim_width = Dimensions.get('window').width;
const dim_height = Dimensions.get('window').height;

const width = dim_width < dim_height ? dim_width : dim_height;
const height = dim_height > dim_width ? dim_height : dim_width;


const styles = StyleSheet.create({
    opacityContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width:'95%',
        margin:'2.5%',
        borderRadius: 15,
        padding: 10,
        backgroundColor: 'white',
    },
    rowSpaceBetweenContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    arrowContainer: {
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    yearContainer: {
        width:'80%',
        alignItems:'center',
        justifyContent: 'center'
    },
    yearText: {
        fontSize: normalize(18),
        textAlign: 'center'
    },
    contentListContainer: {
        padding: 15,
        width:'22%',
        justifyContent:'center',
        alignItems: 'center',
        margin: 2,
        borderWidth: 0.5,
        borderColor: '#CCCCCC',
        borderRadius: 10,
    }
})

export default styles;