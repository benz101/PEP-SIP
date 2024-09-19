import React from 'react';
import {
    TouchableNativeFeedback,
    TouchableOpacity,
    Platform
} from "react-native";

const TouchableItem = Platform.select({
    ios: TouchableOpacity,
    android: TouchableNativeFeedback
})

export default TouchableItem;