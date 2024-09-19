import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import {
//     normalize
// } from 'react-native-elements';
import Login from "../view/Login";
import Home2 from "../view/Home";
import Approval from '../view/Approval/Approval';
import SPVDataEntry from '../view/Approval/SPVDataEntry';
import SPVNoEntryCommit from '../view/Approval/SPVNoEntryCommit';
import SPVApproval from '../view/Approval/SPVApproval';
import SPVListApproval from '../view/Approval/SPVListApproval';
import Account from '../view/Account';
import OilProduction from '../view/Oil/OilProduction';
import OilLifting from '../view/Oil/OilLifting';
import OilSPU from '../view/Oil/OilSPU';
import GasSales from '../view/Gas/GasSales';
import GasProduction from '../view/Gas/GasProduction';
import GasDelivered from '../view/Gas/GasDelivered';
import EP21Minyak from '../view/FmTab/EP21Minyak';
import EP22Gas from '../view/FmTab/EP22Gas';
import FMApproval from '../view/FmTab/FMApproval';
import ProgressInput from '../view/ProgressInput';
import Feedback from '../view/Feedback';
import DetailApproval from '../view/DetailApproval';
import DetailProgressInput from '../view/DetailProgressInput';
import ASMDataEntry from '../view/ASMTab/ASMDataEntry';
import ASMNoEntry from '../view/ASMTab/ASMNoEntry';
import ASMFieldApproval from '../view/ASMTab/ASMFieldApproval';

const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();

// Top Navigation
function SPVTab() {
    return (
        <TopTab.Navigator>
            <TopTab.Screen name='SVP Data Entry' component={SPVDataEntry} />
            <TopTab.Screen name='SPV NoEntry Commit' component={SPVNoEntryCommit} />
            <TopTab.Screen name='SPV Approval' component={SPVApproval} />
        </TopTab.Navigator>
    )
}

function ASMTab() {
    return (
        <TopTab.Navigator>
            <TopTab.Screen name='ASM Data Entry' component={ASMDataEntry} />
            <TopTab.Screen name='ASM No Entry' component={ASMNoEntry} />
            <TopTab.Screen name='ASM Field Approval' component={ASMFieldApproval} />
        </TopTab.Navigator>
    )
}

function FMTab() {
    return (
        <TopTab.Navigator>
            <TopTab.Screen name='EP21' component={EP21Minyak} />
            <TopTab.Screen name='EP22Gas' component={EP22Gas} />
            <TopTab.Screen name='FM Approval' component={FMApproval} />
        </TopTab.Navigator>
    )
}

// Bottom navigation
function NoApproval() {
    return (
        <BottomTab.Navigator>
            <BottomTab.Screen
                name='Home'
                options={{
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
                component={Home2} />
            <BottomTab.Screen
                name='Approval'
                options={{
                    tabBarLabel: 'Approval',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="clipboard-text" color={color} size={size} />
                    ),
                }}
                component={ProgressInput} />
            <BottomTab.Screen
                name='Feedback'
                options={{
                    tabBarLabel: 'Feedback',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="comment" color={color} size={size} />
                    ),
                }}
                component={Feedback} />
            <BottomTab.Screen name='Account'
                options={{
                    tabBarLabel: 'Account',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }} component={Account} />
        </BottomTab.Navigator>
    )
}

function DashboardVew() {
    return (
        <BottomTab.Navigator>
            <BottomTab.Screen
                name='Home'
                options={{
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
                component={Home2} />
            <BottomTab.Screen
                name='Approval'
                options={{
                    tabBarLabel: 'Approval',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="clipboard-text" color={color} size={size} />
                    ),
                }}
                component={ProgressInput} />
            <BottomTab.Screen
                name='Feedback'
                options={{
                    tabBarLabel: 'Feedback',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="comment" color={color} size={size} />
                    ),
                }}
                component={Feedback} />
            <BottomTab.Screen name='Account'
                options={{
                    tabBarLabel: 'Account',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }} component={Account} />
        </BottomTab.Navigator>
    )
}

function Dashboard() {
    return (
        <BottomTab.Navigator>
            <BottomTab.Screen
                name='Home'
                options={{
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
                component={Home2} />
            <BottomTab.Screen
                name='Approval'
                options={{
                    tabBarLabel: 'Approval',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="clipboard-check" color={color} size={size} />
                    ),
                }}
                component={Approval} />
            <BottomTab.Screen
                name='ProgressInput'
                options={{
                    tabBarLabel: 'Approval Status',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="clipboard-text" color={color} size={size} />
                    ),
                }}
                component={ProgressInput} />
            <BottomTab.Screen
                name='Feedback'
                options={{
                    tabBarLabel: 'Feedback',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="comment" color={color} size={size} />
                    ),
                }}
                component={Feedback} />
            <BottomTab.Screen name='Account'
                options={{
                    tabBarLabel: 'Account',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }} component={Account} />
        </BottomTab.Navigator>
    )
}

// Stack Navigation
export default function mainNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Login'>
                <Stack.Screen
                    name='Login'
                    options={{ headerShown: false }}
                    component={Login} />
                <Stack.Screen
                    name='NoApproval'
                    options={{ headerShown: false }}
                    component={NoApproval} />
                <Stack.Screen
                    name='Dashboard'
                    options={{ headerShown: false }}
                    component={Dashboard} />
                <Stack.Screen
                    name='DashboardVew'
                    options={{ headerShown: false }}
                    component={DashboardVew} />
                <Stack.Screen
                    name='ApprovalList'
                    options={{ headerShown: false }}
                    component={SPVListApproval} />
                <Stack.Screen
                    name='ProgressInput'
                    options={{ headerShown: false }}
                    component={ProgressInput} />
                <Stack.Screen
                    name='DetailApproval'
                    options={{ headerShown: false }}
                    component={DetailApproval} />
                <Stack.Screen
                    name='DetailProgressInput'
                    options={{ headerShown: false }}
                    component={DetailProgressInput} />
                {/* Oil */}
                <Stack.Screen
                    name='OilProduction'
                    options={{
                        title: 'OIL PRODUCTION (BOPD)',
                        headerTitleStyle: {
                            fontSize: 14
                        }
                    }}
                    component={OilProduction} />
                <Stack.Screen
                    name='OilLifting'
                    options={{
                        title: 'TOTAL LIFTING OIL LIFTING (BARREL)', headerTitleStyle: {
                            fontSize: 14
                        }
                    }}
                    component={OilLifting} />
                <Stack.Screen
                    name='OilSPU'
                    options={{
                        title: 'RECEIVED AT SPU (BOPD)',
                        headerTitleStyle: {
                            fontSize: 14
                        }
                    }}
                    component={OilSPU} />
                {/* Gas */}
                <Stack.Screen
                    name='GasProduction'
                    options={{
                        title: 'GAS PRODUCTION (MMSCFD)',
                        headerTitleStyle: {
                            fontSize: 14
                        }
                    }}
                    component={GasProduction} />
                <Stack.Screen
                    name='GasSales'
                    options={{
                        title: 'TOTAL MONTHLY GAS SALES (MMSCF)',
                        headerTitleStyle: {
                            fontSize: 14
                        }
                    }}
                    component={GasSales} />
                <Stack.Screen
                    name='GasDelivered'
                    options={{
                        title: 'GAS DELIVERY (MMSCF)', headerTitleStyle: {
                            fontSize: 14
                        }
                    }}
                    component={GasDelivered} />
                <Stack.Screen
                    name='SPVTab'
                    options={{ headerShown: false }}
                    component={SPVTab} />
                <Stack.Screen
                    name='ASMTab'
                    options={{ headerShown: false }}
                    component={ASMTab} />
                <Stack.Screen
                    name='FMTab'
                    options={{ headerShown: false }}
                    component={FMTab} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
