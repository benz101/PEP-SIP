import { StyleSheet } from "react-native";

const styles = StyleSheet.create({    
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageLogo: {
        width: 130,
        height: 130,
        margin: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        flex: 1,
        marginLeft: 0,
        marginRight: 10,
        justifyContent: 'center'
    },
    inputPassword: {
        flex: 1,
        marginLeft: 3,
        marginRight: 10,
        justifyContent: 'center'
    },
    icon: {
        marginLeft: 12,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        borderColor: "#000000",
        backgroundColor: '#ffffff'
    },
    formInput: {
        marginTop: 5,
        paddingBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    viewIcon: {
        right: 0,
        marginTop: 5,
        marginRight: 5,
        paddingBottom: 10,
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
    },
    version: {
        flex: 1,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
})

export default styles;