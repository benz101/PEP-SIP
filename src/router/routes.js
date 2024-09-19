import React from 'react';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    normalize
} from 'react-native-elements';
import { 
    Image,
    View,
    Text
} from "react-native";
import Login from "../view/Login";
import Home2 from "../view/Home";
import globalStyles from '../view/global/styles';
import Approval from '../view/Approval/Approval';
import SpvDataEntry from '../view/Approval/DataEntry';
import SpvNoEntryCommit from '../view/Approval/NoEntryCommit';
import SpvApproval from '../view/Approval/SpvApproval';
import SpvListApproval from '../view/Approval/SpvListApproval';
import Account from '../view/Account';
import OilProduction from '../view/Oil/OilProduction';
import OilLifting from '../view/Oil/OilLifting';
import OilSPU from '../view/Oil/OilSPU';
import GasSales from '../view/Gas/GasSales';
import GasProduction from '../view/Gas/GasProduction';
import GasDelivered from '../view/Gas/GasDelivered';
import NoEntry from '../view/ASMTab/NoEntry';
import DataEntry from '../view/ASMTab/DataEntry';
import FieldApproval from '../view/ASMTab/FieldApproval';
import ASMTabComponent from '../view/ASMTab/ASMTabComponent';
import EP21Minyak from '../view/FmTab/Minyak';
import EP22Gas from '../view/FmTab/Gas';
import FMApproval from '../view/FmTab/Approval';
import SPVTabComponent from '../view/Approval/SPVTabComponent';
import FMTabComponent from '../view/FmTab/FMTabComponent';
import ProgressInput from '../view/ProgressInput';
import Feedback from '../view/Feedback';
import DetailApproval from '../view/DetailApproval';
import DetailProgressInput from '../view/DetailProgressInput';



// Top Navigation
const SPVTab = createMaterialTopTabNavigator(
    {
        DataEntry: {
            screen: props => <SpvDataEntry {...props} />,
            navigationOptions: {
                tabBarLabel: 'Data Entry'
            }
        },
        NoEntryCommit: {
            screen: props => <SpvNoEntryCommit {...props} />,
            navigationOptions: {
                tabBarLabel: 'No Entry (Committed)'
            }
        },
        Approval: {
            screen: props => <SpvApproval {...props} />,
            navigationOptions: {
                tabBarLabel: 'Approval'
            }
        }
    },
    {
        initialRouteName: 'DataEntry',
        tabBarComponent: SPVTabComponent,
        tabBarOptions: {
            upperCaseLabel: false,
            scrollEnabled: true,
            indicatorStyle: {
                borderBottomColor: '#ffffff',
                borderBottomWidth: 2,
            },
            labelStyle: {
                fontSize: 12,
                color: '#ffffff',
                textAlign: 'center',
                alignItems: 'center'
            }
        }
    }
)

const ASMTab = createMaterialTopTabNavigator({
    DataEntry: {
        screen: DataEntry,
        navigationOptions: {
            tabBarLabel: "Data Entry"
        }
    },
    NoEntry: {
        screen: NoEntry,
        navigationOptions: {
            tabBarLabel: "No Entry"
        }
    },
    FieldApproval: {
        screen: FieldApproval,
        navigationOptions: {
            tabBarLabel: "Field Approval"
        }
    }
}, {
    tabBarComponent: ASMTabComponent,
    tabBarOptions: {
        scrollEnabled: true,
        indicatorStyle: {
            backgroundColor: 'white',
            borderColor: 'white'
        }
    },
    lazy: false
})

const FMTab = createMaterialTopTabNavigator(
    {
        EP21Minyak: {
            screen: props => <EP21Minyak {...props} />,
            navigationOptions: {
                tabBarLabel: 'EP21 (Minyak)'
            }
        },
        EP22Gas: {
            screen: props => <EP22Gas {...props} />,
            navigationOptions: {
                tabBarLabel: 'EP22 (Gas)'
            }
        },
        FMApproval: {
            screen: props => <FMApproval {...props} />,
            navigationOptions: {
                tabBarLabel: 'Approval'
            }
        }
    },
    {
        initialRouteName: 'EP21Minyak',
        tabBarComponent: FMTabComponent,
        tabBarOptions: {
            upperCaseLabel: false,
            scrollEnabled: true,
            indicatorStyle: {
                borderBottomColor: '#ffffff',
                borderBottomWidth: 2,
            },
            labelStyle: {
                fontSize: 12,
                color: '#ffffff',
                textAlign: 'center',
                alignItems: 'center'
            }
        }
    }
)


// Bottom navigation

const Dashboard = createBottomTabNavigator({
    Home: {
        screen: Home2,
        navigationOptions: {
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="home" color={tintColor} size={normalize(27)} />
        }
    },
    Approval: {
        screen: Approval,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="clipboard-check" color={tintColor} size={normalize(27)} />
        }
    },
    ApprovalStatus: {
        screen: ProgressInput,
        navigationOptions : {
          tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="clipboard-text" color={tintColor} size={normalize(27)} />
        }
      },
    Feedback: {
        screen : Feedback,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="comment" color={tintColor} size={normalize(27)} />
        }
    },
    Account: {
        screen: Account,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="account" color={tintColor} size={normalize(27)} />
        }
    }
}, {
    animationEnabled: false,
    tabBarOptions: {
        activeTintColor: '#05558f'
    },
})

const DashboardVew = createBottomTabNavigator({
    Home: {
        screen: Home2,
        navigationOptions: {
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="home" color={tintColor} size={normalize(27)} />
        }
    },
    ApprovalStatus: {
        screen: ProgressInput,
        navigationOptions : {
          tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="clipboard-text" color={tintColor} size={normalize(27)} />
        }
    },
    Feedback: {
        screen : Feedback,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="comment" color={tintColor} size={normalize(27)} />
        }
    },
    Account: {
        screen: Account,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="account" color={tintColor} size={normalize(27)} />
        }
    }
}, {
    animationEnabled: false,
    tabBarOptions: {
        activeTintColor: '#05558f'
    }
})

const NoApproval = createBottomTabNavigator({
    "Home": {
        screen: Home2,
        navigationOptions: {
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="home" color={tintColor} size={normalize(27)} />
        }
    },
    ApprovalStatus: {
        screen: ProgressInput,
        navigationOptions : {
          tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="clipboard-text" color={tintColor} size={normalize(27)} />
        }
    },
    Feedback : {
        screen : Feedback,
        navigationOptions: {
          tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="comment" color={tintColor} size={normalize(27)} />
        }
    },
    Account: {
        screen: Account,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="account" color={tintColor} size={normalize(27)} />
        }
    }
}, {
    animationEnabled: false,
    tabBarOptions: {
        activeTintColor: '#05558f'
    }
})


// Stack Navigation
const mainNavigation = createStackNavigator({
    Login: {
        screen: Login
    },
    NoApproval: {
        screen: NoApproval,
        navigationOptions: ({ navigation }) => ({
            headerLeft: () => (
                <View style={globalStyles.smallLogoContainer} >
                    <Image source={require('../assets/images/headerLogo.jpg')} style={{ height:'75%' }} resizeMethod='resize' resizeMode='contain'  />
                </View>
            ),
            headerStyle: {
                elevation: 0
            },
            headerTitleStyle: {
                flex:1,
                alignSelf:'center',
                textAlign:'center'
            },
            headerRight: (
                <Text style={{ fontSize: normalize(16), color: 'black', marginRight: 15 }}>{navigation.state.params.user.username}</Text>
            )
        })
    },
    Dashboard: {
        screen: Dashboard,
        navigationOptions: ({ navigation }) => ({
            headerLeft: () => (
                <View style={globalStyles.smallLogoContainer} >
                    <Image source={require('../assets/images/headerLogo.jpg')} style={{ height:'75%' }} resizeMethod='resize' resizeMode='contain'  />
                </View>
            ),
            headerStyle: {
                elevation: 0
            },
            headerTitleStyle: {
                flex:1,
                alignSelf:'center',
                textAlign:'center'
            },
            headerRight: (
                <Text style={{ fontSize: normalize(16), color: 'black', marginRight: 15 }}>{navigation.state.params.user.username}</Text>
            )
        })
    },
    DashboardVew: {
        screen: DashboardVew,
        navigationOptions: ({ navigation }) => ({
            headerLeft: () => (
                <View style={globalStyles.smallLogoContainer} >
                    <Image source={require('../assets/images/headerLogo.jpg')} style={{ height:'75%' }} resizeMethod='resize' resizeMode='contain'  />
                </View>
            ),
            headerStyle: {
                elevation: 0
            },
            headerTitleStyle: {
                flex:1,
                alignSelf:'center',
                textAlign:'center'
            },
            headerRight: (
                <Text style={{ fontSize: normalize(16), color: 'black', marginRight: 15 }}>{navigation.state.params.user.username}</Text>
            )
        })
    },
    ApprovalList: {
        screen: SpvListApproval
    },
    SPVTab: {
        screen: SPVTab,
        navigationOptions: {
            header: null
        }
    },
    FMTab: {
        screen: FMTab,
        navigationOptions: {
            header: null
        }
    },
    OilProduction: {
        screen: OilProduction
    },
    OilLifting: {
        screen: OilLifting
    },
    OilSPU: {
        screen: OilSPU
    },
    GasProduction: {
        screen: GasProduction
    },
    GasSales: {
        screen: GasSales
    },
    GasDelivered: {
        screen: GasDelivered
    },
    ASMTab: {
        screen: ASMTab,
        navigationOptions: {
            header: null
        }
    },
    DetailApproval: {
      screen: DetailApproval
    },
    DetailProgressInput: {
        screen: DetailProgressInput
    }
}, {
    initialRouteName: "Login"
})

export default createAppContainer(mainNavigation);