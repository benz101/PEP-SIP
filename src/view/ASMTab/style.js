import { 
    StyleSheet
} from "react-native";
import { height } from "../../assets/constants/config";
import { normalize } from "react-native-elements";

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    headerContainer: {
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    headerTitleContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    textKet: {
        marginTop: 15,
        marginBottom: 15
    },
    icon: {
        marginLeft: 10,
        marginRight: 15,
        alignItems: 'center',
    },
    inputComment: {
        height: 100,
        borderWidth: 1,
        marginLeft: 15,
        marginRight: 15,
        borderColor: '#cccccc',
        textAlignVertical: 'top'
    },
    historyContainer: {
        marginTop: 15,
        marginBottom: 15,
        paddingLeft: 5,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    contentContainer: {
        marginVertical: 15,
        elevation: 7,
        borderWidth: 0.4,
        borderColor: '#e1e8ee',
        marginHorizontal: '1.5%',
    },
    divider: {
        backgroundColor: '#CCCCCC',
        marginVertical: height * 0.01
    },
    approvalRowListContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listContainer: {
        height: height * 0.3,
        marginHorizontal: 15
    },
    listRowWrapper: {
        width: '100%',
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listContent: {
        width: '50%',
        borderColor: '#e1e8ee',
        borderWidth: 0.8,
        justifyContent: 'center'
    },
    rowListDataEntry: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dataEntryContainer: {
        justifyContent: 'center',
        padding: 10,
        width: '50%',
        borderWidth: 0.8,
        borderColor: '#e1e8ee'
    },
    dataEntryText: {
        fontSize: normalize(12),
        color: 'black'
    }
})