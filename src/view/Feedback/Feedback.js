import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import colors from '../../assets/constants/colors';
import configUrl from '../../assets/constants/config';
import styles from './styles';

export default function Feedback() {
    const [feedback, setFeedback] = useState('');

    const onSubmitPress = async () => {
        const body = {
            script_name: "api/v2/api_feedback",
            data: {
                feedback: feedback
            }
        }

        if (feedback == '') {
            Alert.alert('Error', 'Feedback cannot be empty')
        } else {
            try {
                const result = await axios.post(`${configUrl.https}`, body, {
                    timeout: 20000
                })
                const json = result.data;
                if (json.status == "0000") {
                    Alert.alert('Notification', 'Success')
                    // feedbackInput.clear()
                }
            } catch (err) {
                Alert.alert("Notification", "Failed to send feedback");
                console.log("Error: "+err);
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Input Feedback </Text>
            <TextInput
                style={styles.inputSaran}
                multiline={true}
                // ref={input => this.feedbackInput = input}
                placeholder="Enter feedback for this application"
                placeholderTextColor="#c1c1c1"
                underlineColorAndroid="transparent"
                onChangeText={(feedback) => setFeedback(feedback)}
            />
            <Button
                containerStyle={{ margin: '3%' }}
                buttonStyle={{ backgroundColor: colors.blue }}
                title="SUBMIT"
                onPress={onSubmitPress}
            />
        </View>
    )
}