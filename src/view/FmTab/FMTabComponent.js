import React, { useEffect, useState } from 'react';
import { InteractionManager } from "react-native";
import {
    TabBar
} from 'react-native-tab-view'
import Animated from "react-native-reanimated";
import Loader from '../../assets/elements/Loader';

export default function FMTabComponent(props) {

    const [ready, setReady] = useState(false);

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => setReady(true));
    }, [])


    if (!ready) {
        return <Loader visible={!ready} />
    }
    const backgroundColor = Animated.interpolate(props.navigationState.index, {
        inputRange: [0, 1, 2],
        outputRange: [Animated.color(234, 29, 46), Animated.color(5, 107, 181), Animated.color(171, 194, 54)],
    })
    return (
        <TabBar
            {...props}
            style={{ backgroundColor }}
            jumpToIndex={index => props.jumpToIndex(index)}
        />
    )
}