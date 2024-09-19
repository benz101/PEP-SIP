import React, { PureComponent, useEffect, useState } from 'react';
import {
	View,
	FlatList,
	Text,
	StatusBar,
	InteractionManager
} from "react-native";
import globalStyles from '../global/styles';
import Loader from '../../assets/elements/Loader';
import { useSelector } from 'react-redux';

export default function ASMNoEntry() {
	const [ready, setReady] = useState(false);
	const asmResult = useSelector((state) => state.asm.params);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => setReady(true))
		StatusBar.setBarStyle('light-content');
		StatusBar.setBackgroundColor('#056bb5')
	}, []);


	const renderItem = ({ item, index }) => {
		const backgroundColor = index % 2 == 0 ? 'white' : '#cccccc'
		return (
			<View style={{ flexDirection: 'row', backgroundColor }}>
				<View style={{ width: '10%', borderRightWidth: 0.7, borderColor: '#e1e8ee', alignItems: 'center', borderColor: '#e1e8ee', justifyContent: 'center' }}>
					<Text style={{ color: '#222' }}>{index + 1}</Text>
				</View>
				<View style={{ paddingHorizontal: '2%', paddingVertical: 10, flexShrink: 1, }}>
					<Text style={{ color: '#222' }} >{item[1]}</Text>
				</View>
			</View>
		)
	}

	if (!ready) {
		return <Loader visible={!ready} />
	}
	return (
		<View style={globalStyles.container}>
			<FlatList
				data={asmResult.data.noentrylist}
				ListHeaderComponent={() => {
					return (
						<View style={{ flexDirection: 'row', backgroundColor: '#CCCCCC', borderColor: '#e1e8ee', borderBottomWidth: 1 }}>
							<View style={{ width: '10%', borderRightWidth: 0.7, borderColor: '#e1e8ee', alignItems: 'center', justifyContent: 'center' }}>
								<Text style={{ color: '#222', fontWeight: 'bold' }}>No</Text>
							</View>
							<View style={{ paddingHorizontal: '2%', paddingVertical: 10, flex: 1, alignItems: 'center' }}>
								<Text style={{ color: '#222', textAlign: 'center', fontWeight: 'bold' }} >Entry</Text>
							</View>
						</View>
					)
				}}
				// extraData={props}
				renderItem={renderItem}
				keyExtractor={(item, index) => item[0].toString()}
			/>
		</View>
	)
}