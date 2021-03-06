import React, {Component} from 'react'

import { DateField } from 'react-date-picker'
import 'react-date-picker/index.css'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from "../../actions/recycleBinActions.js";

class RecycleBinFilter extends Component {

	constructor(props) {
		super(props);

		this.showFiltersContainer = this.showFiltersContainer.bind(this);
		this.onChangeFrom = this.onChangeFrom.bind(this);
		this.onChangeTo = this.onChangeTo.bind(this);
	}

	showFiltersContainer() {

		if (this.props.recycleBin.showRecycleBinFilters) {
			return "show-container"
		} 

		return "hide-container";
	}


	onChangeFrom(dateString, { dateMoment, timestamp }) {
		this.props.setFilterDateFrom(dateString);
	}

	onChangeTo(dateString, { dateMoment, timestamp }) {
		this.props.setFilterDateTo(dateString);
	}

	render() {

		const { usersNames } = this.props.recycleBin;

		return(

			<div className={"recycle-bin-filter-bar "+ this.showFiltersContainer()}>
				<div className="filter-box clearfix margin-left-4px">
						<div className="checkbox-group">
							<input type="checkbox" id="cbObjectives" defaultChecked={true} onClick={this.setObjectiveType.bind(this)}></input>
							<label htmlFor="cbObjectives">Objectives</label>
						</div>
						<div className="checkbox-group">
							<input type="checkbox" id="cbKey" defaultChecked={true}  onClick={this.setKeyType.bind(this)}></input>
							<label htmlFor="cbKey">Key results</label>
						</div>
					</div>
				<table className="recycle-bin-filter-table">
					<tbody>
						<tr>
						    <td className="cell-right-align">
							    <input type="text" id="type-category-filter" placeholder="Enter type or category" ref="inputFilter" onChange={this.typeOrCategoryFilter.bind(this)}/>
						    </td>
							<td className="cell-right-align">Date: </td>
							<td className="no-wrap">
							<DateField
									className="date-field"
									placeholder="From"
									dateFormat="YYYY-MM-DD"
									onChange={this.onChangeFrom}
									footer={false}
									updateOnDateClick={true}
									collapseOnDateClick={true}
									theme={false}
									ref="dateFrom"/>
								<DateField
									className="date-field"
									placeholder="To"
									dateFormat="YYYY-MM-DD"
									onChange={this.onChangeTo}
									footer={false}
									updateOnDateClick={true}
									collapseOnDateClick={true}
									theme={false}
									ref="dateTo"/>
							</td>
							<td>
								<select ref="userName" onChange={this.changeUserName.bind(this)}>
								   <option id="reset-option" value="" disabled className="not-display">By User Name</option>
								   <option value="">No one</option>
								   {usersNames.map((name) => {
                   		return <option key={name.id} value={name.name}>{name.name}</option>
                   })}
								</select>
							</td>
							<td className="cell-right-align" colSpan="2">
								<button className="btn btn-filter" onClick={this.reset.bind(this)}>Reset</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

		)
	}


	reset() {

		document.querySelector("#cbObjectives").checked = true;
		document.querySelector("#cbKey").checked = true;

		document.querySelector("#reset-option").selected = true;

		document.querySelector("#type-category-filter").value = "";

		this.refs.dateFrom.onFieldChange('');
		this.refs.dateTo.onFieldChange('');

		this.props.updateAll("", "", "", true, true, false, false, "", false);

	}

	componentDidMount() {
		document.querySelector("#reset-option").selected = true;
	}

	changeUserName() {
		this.props.setUserName(this.refs.userName.value);
	}

	typeOrCategoryFilter() {
		this.props.typeOrCategoryFilter(this.refs.inputFilter.value);
	}

    setCategoryType() {
		this.props.setCategoryType(document.querySelector("#cbCategory").checked);
	}

	setKeyType() {
		this.props.setKeyType(document.querySelector("#cbKey").checked);
	}

    setObjectiveType() {

		this.props.setObjectiveType(document.querySelector("#cbObjectives").checked);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
	return {
		recycleBin: state.recycleBin
	};
}

const RecycleBinFilterConnected = connect(mapStateToProps, mapDispatchToProps)(RecycleBinFilter);
export default RecycleBinFilterConnected
