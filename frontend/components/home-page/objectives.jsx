import React, { Component } from 'react';
import Quarter from './quarter.jsx';
import ObjectiveItem from './objective.jsx';
import ObjectivesList from '../common/objective/objective-list.jsx';

import { isEmpty, isCorrectId } from '../../../backend/utils/ValidateService';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as myStateActions from "../../actions/myStateActions";
import * as objectiveActions from "../../actions/objectiveActions";

class Objectives extends Component {
	constructor(props) {
		super(props);

		this.changeTab = this.changeTab.bind(this);
		this.changeYear = this.changeYear.bind(this);
		this.handleAddingNewQuarter = this.handleAddingNewQuarter.bind(this);
		this.createObjective = this.createObjective.bind(this);
		this.changeKeyResultScore = this.changeKeyResultScore.bind(this);
		this.getObjectiveAutocompleteData = this.getObjectiveAutocompleteData.bind(this);
	}

	changeTab(num) {
		this.props.myStateActions.setChangeTab(num);
	}

	changeYear(year) {
		this.props.myStateActions.setChangeYear(year);
	}

	handleAddingNewQuarter(newQuarter) {
		let confirmation = confirm("Do you really want to create new quarter?");

		if(confirmation) {
			this.props.myStateActions.createQuarter(newQuarter);
			this.changeTab(newQuarter);
		}
	}

	changeKeyResultScore(objectiveId) {
		let apiCall = this.props.myStateActions.changeKeyResultScore;
		
		return (keyResultId) => {
			return (score) => {
				if(!isCorrectId(objectiveId) 
				|| !isCorrectId(keyResultId)) {
					return;
				}

				let body = {
					keyResultId: keyResultId,
					score: score
				};

				apiCall(objectiveId, body);
			};
		};
	}

	createObjective(categoryId) {
		return (title) => {
			let quarters = this.props.myState.me.quarters;
			let selectedYear = this.props.myState.selectedYear;
			let selectedTab = this.props.myState.selectedTab;

			let quarter = quarters.find((quarter) => {
				return (quarter.index == selectedTab) && (quarter.year == selectedYear);
			});

			let body = {
				title: title,
				category: categoryId,
				quarterId: quarter._id
			};

			this.props.myStateActions.addNewObjective(body);
		};
	}

	getObjectiveAutocompleteData(categoryId) {
		let selectedYear = this.props.myState.selectedYear;
		let selectedTab = this.props.myState.selectedTab;
		
		return (title) => {
			this.props.objectiveActions.getAutocompleteObjectives(categoryId, selectedYear, selectedTab, title);
		};
	}

	render() {
		const myState = this.props.myState;
		const { me, selectedYear, selectedTab, existedQuarters } = myState;

		const categories = this.props.categories;

		console.log('myState', myState);

		var objectiveItems = [];
		var quarter = {};
		var objectives = [];

		console.log('selectedYear, selectedTab', selectedYear, selectedTab);

		if (me.quarters != undefined) {
			quarter = me.quarters.find((quarter) => {
				return (quarter.year == selectedYear) && (quarter.index == selectedTab)
			});

			console.log('quarter', me.quarters);

			objectives = quarter.userObjectives;
		}

		return (
			<div id="home-page-wrapper">
				<Quarter changeTab={ this.changeTab } changeYear={this.changeYear}
				selectedTab={ selectedTab } existedQuarters={ existedQuarters } addNewQuarter={ this.handleAddingNewQuarter } />
				<div id='objectives'>
					<ObjectivesList objectives={ objectives } categories={ categories.list }
					my={ true } ObjectiveItem={ ObjectiveItem } softDeleteMyObjectiveByIdApi={ this.props.myStateActions.softDeleteMyObjectiveByIdApi }
					changeKeyResultScore={ this.changeKeyResultScore }
					createObjective={ this.createObjective } 
					getObjectiveAutocompleteData={ this.getObjectiveAutocompleteData } />
				</div>
			</div>
		)
	}
}

Objectives.defaultProps = { today: new Date() };

function mapDispatchToProps(dispatch) {
	return {
		myStateActions: bindActionCreators(myStateActions, dispatch),
		objectiveActions: bindActionCreators(objectiveActions, dispatch),
	}
}

function mapStateToProps(state) {
	return {
		myState: state.myState,
		categories: state.categories
	};
}

const ObjectivesConnected = connect(mapStateToProps, mapDispatchToProps)(Objectives);

export default ObjectivesConnected;
