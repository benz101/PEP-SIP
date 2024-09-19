import React, { Component } from 'react';
import { createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator, DrawerActions} from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import DrawerComponents from './Pages/DrawerComponents';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Produksi from './Pages/Oil/Produksi';
import Lifting from './Pages/Oil/Lifting';
import SPU from './Pages/Oil/SPU';
import GasProduksi from './Pages/Gas/Produksi';
import Sales from './Pages/Gas/Sales';

const HomeStackNav = createStackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: ({ navigation }) => {
                return {
                    title: 'Home',
                    headerLeft: (
                        <Icon name="ios-menu" size={27} color="#000000" style={{ marginLeft: 20, alignItems: 'center' }} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
                    )
                }
            }
        }
    }
)


const DrawerNav = createDrawerNavigator(
    {
        HomeStackNav: {
            screen: HomeStackNav,
            navigationOptions: {
                drawerLabel: 'Home',
                drawerIcon: ({ tintColor }) => (
                    <Icon name="ios-home" size={20} style={{ color: tintColor }} />
                )
            }
        }
    },
    {
        initialRouteName: 'HomeStackNav',
        contentOptions: {
            activeTintColor: '#ffffff',
            activeBackgroundColor: '#3dbeff'
        },
        contentComponent: props => <DrawerComponents {...props} />,
    }
)


export default Routes = createStackNavigator(
    {
        Login: {
            screen: Login,
        },
        Home: {
            screen: DrawerNav,
            navigationOptions: {
                header: null
            }
        },
        Produksi: {
            screen: Produksi,
            navigationOptions: ({ navigation }) => {
                return {
                    title: 'Oil Produksi'
                }
            }
        },
        OilSPU: {
            screen: SPU,
            navigationOptions: ({ navigation }) => {
                return {
                    title: 'Oil SPU'
                }
            }
        },
        Lifting: {
            screen: Lifting,
            navigationOptions: ({ navigation }) => {
                return {
                    title: 'Oil Lifting'
                }
            }
        },
        GasProduksi: {
            screen: GasProduksi,
            navigationOptions: ({ navigation }) => {
                return {
                    title: 'Gas Produksi'
                }
            }
        },
        Sales: {
            screen: Sales,
            navigationOptions: ({ navigation }) => {
                return {
                    title: 'Gas Sales'
                }
            }
        },
    }
)
