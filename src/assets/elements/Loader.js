import React, { PureComponent } from 'react';
import {
	View,
	Modal,
	ActivityIndicator
} from "react-native";
import styles from './styles';

export default Loader = (props) => (
	<Modal
		onRequestClose={() => false}
		transparent
		visible={props.visible}
	>
		<View style={styles.opacityContainer}>
			<ActivityIndicator size="large" color="white" />
		</View>
	</Modal>
)