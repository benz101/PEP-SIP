import {
	StyleSheet,
	Dimensions
} from "react-native";


const dim_width = Dimensions.get('window').width;
const dim_height = Dimensions.get('window').height;

const width = dim_width < dim_height ? dim_width : dim_height;
const height = dim_height > dim_width ? dim_height : dim_width;


const globalStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	smallLogoContainer: {
		flex: 1,
		width: width * 0.32,
		height: '100%',
		paddingLeft: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	rowSpaceBetweenContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	centerContainer: {
		flex: 1,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center'
	},
	opacityContainer: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.2)',
		justifyContent: 'center',
	},
	peopleListContainer: {
		padding: 15,
		justifyContent: 'center',
		backgroundColor: 'white',
	}
})

export default globalStyles;