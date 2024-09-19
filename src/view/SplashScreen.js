import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';

export default class SplashScreen extends Component {

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../../src/assets/images/ic_logo.jpg')} />
                    <View style={styles.garis} />
                    <Text style={styles.textLogo}>Sistem Operasi Terpadu</Text>
                </View>
                {/* <View style={styles.version}>
                    <Text>v 1.1.2</Text>
                </View> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    logoContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 150,
        height: 150
    },
    garis: {
        width: 20,
        borderColor: 'grey',
        borderWidth: 0.5
    },
    textLogo: {
        fontSize: 28,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    messageText: {
        fontSize: 16,
        textAlign: 'center'
    },
    version: {
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }
})