import { StyleSheet } from "react-native";
import colors from "../../assets/constants/colors";
import { height, width } from "../../assets/constants/config";
import { normalize } from "react-native-elements";

const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: '2.5%',
        borderWidth: 0,
        marginTop: 0,
        borderRadius: 7,
        marginBottom: '3%',
        backgroundColor: colors.green,
        padding: 0,
        paddingBottom: '1.5%',
    },
    cardContainerHeader: {
        height: height * 0.05,
        backgroundColor: colors.darkGreen,
        borderTopStartRadius: 7,
        borderTopEndRadius: 7,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '2%'
    },
    cardContainerContent: {
        height: height * 0.135,
        width : width * 0.95,
        // justifyContent: 'space-around',
        alignItems: 'flex-end',
        flexDirection: 'row',
        // paddingHorizontal: '1.5%',
    },
    cardContainerIcon: {
        width: '25%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    titleText: {
        fontSize: normalize(16),
        color: 'white',
        fontWeight: 'bold'
    },
    contentText: {
        fontSize: normalize(12),
        color: 'white',
        textAlign: 'center',
    },
    redCardContainer: {
        marginHorizontal: '2.5%',
        borderWidth: 0,
        marginTop: 0,
        borderRadius: 7,
        marginBottom: '3%',
        backgroundColor: colors.red,
        padding: 0,
        paddingBottom: '1.5%',
    },
    redCardContainerHeader: {
        height: height * 0.05,
        backgroundColor: colors.darkRed,
        borderTopStartRadius: 7,
        borderTopEndRadius: 7,
        justifyContent: 'center',
        paddingHorizontal: '2%'
    },
    redCardContainerContent: {
        height: height * 0.135,
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingHorizontal: '1.5%',
    },
    redCardContainerIcon: {
        width: '25%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    
    blueCardContainer: {
        marginHorizontal: '2.5%',
        borderWidth: 0,
        marginTop: 0,
        borderRadius: 7,
        marginBottom: '3%',
        backgroundColor: colors.blue,
        padding: 0,
    },
    blueCardContainerHeader: {
        height: height * 0.05,
        backgroundColor: colors.darkBlue,
        borderTopStartRadius: 7,
        borderTopEndRadius: 7,
        justifyContent: 'center',
        paddingHorizontal: '2%'
    },
    blueCardContainerIcon: {
        width: '100%%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    subtitleContainer: {
        paddingHorizontal: '3%',
        marginVertical: '0.7%',
        paddingVertical: '0.7%',
    },
    subtitleText: {
        fontSize: normalize(14),
        fontWeight: 'bold',
        color: 'white'
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '50%', 
        backgroundColor: colors.darkBlue,
        paddingVertical: 5
    },
    valueContentContainer1: {
        width:'60%',
        justifyContent: 'flex-start',
    },
    valueContentContainer2: {
        width:'40%',
        justifyContent: 'flex-end',
    },
    contentTextValue: {
        fontSize: normalize(12),
        textAlign: 'right',
        color: 'white'
    },
    errorSummaryContainer: {
        padding: '3%',
        alignItems:'center',
        justifyContent: 'center'
    },
    greyContainerHeader: {
        height: height * 0.05,
        backgroundColor: colors.darkGrey,
        borderTopStartRadius: 7,
        borderTopEndRadius: 7,
        justifyContent: 'center',
        paddingHorizontal: '2%'
    },
    greyCardContainer: {
        marginHorizontal: '2.5%',
        borderWidth: 0,
        marginTop: 0,
        borderRadius: 7,
        marginBottom: '3%',
        backgroundColor: colors.greyLight,
        padding: 0,
        paddingBottom: '1.5%',
    },
    greyCardContainerContent: {
        marginVertical: '2.5%',
        marginHorizontal: '2.5%',
        flexDirection: 'row',
        paddingHorizontal: '1.5%',
    },
    swipeCardContainer: {
      width: width * 0.85,
      height: height * 0.15,
      borderWidth: 0,
      marginTop: 0,
      borderRadius: 7,
      backgroundColor: colors.blue,
      padding: 0,
      marginBottom: 25,
      marginHorizontal: 5,
      marginLeft: width * 0.025
    }
})

export default styles;