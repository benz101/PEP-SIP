import { StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';
import colors from '../../assets/constants/colors';

const styles = StyleSheet.create({
    formContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
    },
    iconContainer: {
        width: '5%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    labelStyle: {
        fontSize: normalize(14),
        fontWeight: 'bold'
    },
    flatListContainer: {
        borderWidth: 1,
        // borderBottomLeftRadius: 10,
        // borderBottomRightRadius: 10,
        borderTopWidth: 0,
        borderColor: colors.blue,
        paddingBottom: 0,
        backgroundColor: colors.darkBlue
    },
    subtitle: {
        fontWeight:'bold',
        fontSize: normalize(12),
        color: 'white',
        marginHorizontal: '3%'
    },
    orgListContainer: {
        backgroundColor: colors.blue
    },
    orgListText: {
        fontWeight:'bold',
        fontSize: normalize(14),
        color: 'white',
        marginHorizontal: '5%',
        paddingVertical: '3%'
    },
    rowListDataEntry: {
        flexDirection: 'row',
        justifyContent: 'center',
        width:'100%'
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

export default styles