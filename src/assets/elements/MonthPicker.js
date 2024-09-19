import React from 'react';
import {
    View,
		Text,
		Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import globalStyles from '../../view/global/styles';
import styles from './styles';
import { normalize, Divider } from 'react-native-elements';
import TouchableItem from '../../view/global/Touchable';
import moment from 'moment';
import colors from '../constants/colors';

const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""]

const month1 = ["Jan", "Feb", "Mar", "Apr"]
const month2 = ["May", "Jun", "Jul", "Aug"]
const month3 = ["Sep", "Oct", "Nov", "Dec"]

export default class Picker extends React.PureComponent{

	constructor(props){
		super(props);
		this.state = {
			years: [],
			newArr: [],
			selected: null,
			selectedMonth: moment().format("MMM"),
			selectedDate: ""
		}
	}
	
	componentDidMount(){
		this.getYearRange();
	}
	
	getYearRange(){
		const currentYear = new Date().getFullYear()
		let years=[]
		let startYear = 1980;
		while(startYear <= 2040){
			years.push(startYear++)
		}
		return this.setState({
			years,
			selected: years.indexOf(currentYear)
		})
	}

	sliceMonths(){
		let start = 0
		let newArr = []
		let component = []
		for(i in Months){
			if(i % 4 == 0){
				start = i;
				newArr = Months.slice(start, i)
				component = [...component, newArr.map((arr) => <Text>{arr}</Text>)]
			}
		}
	}

	renderMonths(months){
		return <View style={styles.rowSpaceBetweenContainer}>
		{months.map((month) => {
			const bgColor = month == this.state.selectedMonth ? colors.blue : 'white'
			const textColor = month == this.state.selectedMonth ? 'white' : 'black'
			return (
				<TouchableItem
					key={month}
					onPress={() => {
					this.setState({
						selectedDate: `01-${month}-${this.state.years[this.state.selected]}`,
						selectedMonth: moment(`01-${month}-${this.state.years[this.state.selected]}`, "DD-MMM-YYYY").format("MMM")
					})
					const fullDate = moment(`01-${month}-${this.state.years[this.state.selected]}`, "DD-MMM-YYYY").format("DD-MM-YYYY")
					const monthYear = moment(`01-${month}-${this.state.years[this.state.selected]}`, "DD-MMM-YYYY").format("MMMM YYYY")
					this.props.onChangeDate(fullDate, monthYear)
				}} >
					<View style={[styles.contentListContainer, { backgroundColor: bgColor }]}>
						<Text style={{ color: textColor }} >{month}</Text>
					</View>
				</TouchableItem>
			)
		})}
		</View>
	}
	
	render(){
		const { selected, years } = this.state;
		return(
			<Modal
				visible={this.props.visible}
				onRequestClose={this.props.onRequestClose}
				transparent
			>
				<View style={styles.opacityContainer}>
					<View style={styles.container} >
						<View style={styles.rowSpaceBetweenContainer}>
							<TouchableItem onPress={() => this.setState({ selected: selected - 1 }) } >
								<View style={styles.arrowContainer}>
									<Icon name="ios-arrow-back" size={normalize(20)} />
								</View>
							</TouchableItem>

							<TouchableItem>
								<View style={styles.yearContainer}>
									<Text style={styles.yearText}>{years[selected]}</Text>
								</View>
							</TouchableItem>
							
							<TouchableItem onPress={() => this.setState({ selected: selected + 1 }) } >
								<View style={styles.arrowContainer}>
									<Icon name="ios-arrow-forward" size={normalize(20)} />
								</View>
							</TouchableItem>
						</View>
						
						<Divider style={{ marginVertical: '2%' }} />
						
						{this.renderMonths(month1)}
						{this.renderMonths(month2)}
						{this.renderMonths(month3)}
					</View>
				</View>
			</Modal>
		)
	}
}