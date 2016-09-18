import React, { Component } from 'react';
import Quarterbar from '../quarterbar/quarters.jsx';
import ObjectiveItem from './objective.jsx';
import ObjectivesList from './objective-list.jsx';
import sweetalert from 'sweetalert';
import '../styles/sweetalert.css';

import { isEmpty, isCorrectId } from '../../../../backend/utils/ValidateService';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as keyResultActions from "../../../actions/keyResultActions";
import * as myStateActions from "../../../actions/myStateActions";
import * as objectiveActions from "../../../actions/objectiveActions";
import * as otherPersonActions from "../../../actions/otherPersonActions";
import * as userDashboardActions from "../../../actions/userDashboardActions";

import './objectives.scss';

const CONST = require('../../../../backend/config/constants.js');

import cookie from 'react-cookie';

const session = cookie.load('user-id');

const notifications = require("../../../actions/notifications.js");

class Objectives extends Component {
	constructor(props) {
		super(props);

		this.changeTab = this.changeTab.bind(this);
		this.changeYear = this.changeYear.bind(this);
		this.handleAddingNewQuarter = this.handleAddingNewQuarter.bind(this);
		this.createObjective = this.createObjective.bind(this);
		this.changeKeyResultScore = this.changeKeyResultScore.bind(this);
		this.getObjectiveAutocompleteData = this.getObjectiveAutocompleteData.bind(this);
		this.handleArchive = this.handleArchive.bind(this);
		this.handleArchivingQuarter = this.handleArchivingQuarter.bind(this);
	}

	componentWillMount() {
		this.props.myStateActions.getMe();
	}

	changeTab(num) {
		this.props.myStateActions.setChangeTab(num);
	}

	handleArchive (changeTo, objectiveId) {
		let handler = function () {
			this.props.myStateActions.changeArchiveStatus(changeTo, objectiveId);
		}.bind(this);

		let arch = changeTo ? 'archive' : 'unarchive';

		sweetalert({
			title: `Do you really want to ${arch} this objective?`,
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#4caf50",
			confirmButtonText: "OK",
			closeOnConfirm: true
		}, function(){handler();});
	}

	changeYear(year) {

		const { user } = this.props.user;
		const userId = this.props.userId || session._id;
		this.props.myStateActions.setChangeYear(year);
		if ((user._id != undefined) && (userId != undefined) && (user._id == userId))
			this.props.userDashboardActions.getStats("otherPersonPage")
		else
			this.props.userDashboardActions.getStats();
	}

	handleAddingNewQuarter(newQuarter) {
		sweetalert({
			title: "Create new quarter?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#4caf50",
			confirmButtonText: "Yes, create",
			closeOnConfirm: true
		}, () => {
			this.props.myStateActions.createQuarter(newQuarter);
			// this.changeTab(newQuarter.index);
		});
	}

	componentWillUnmount() {
		this.props.myStateActions.reset();
	}

	handleArchivingQuarter(index) {
		var quarterId;
		var flag;
		const { user } = this.props.user;
		if ((user._id != undefined) && (userId != undefined) && (user._id == userId)) 
			{
			this.props.user.user.quarters.forEach( (quarter) => {
				if (quarter.index == index && quarter.year == this.props.user.selectedYear)
				{
					quarterId = quarter._id;
					flag = !quarter.isArchived;
				}
			})
			this.props.otherPersonActions.archiveUserQuarter(quarterId, flag);
		}			
		else	
		{
			this.props.myState.me.quarters.forEach( (quarter) => {
				if (quarter.index == index && quarter.year == this.props.myState.selectedYear)
				{
					quarterId = quarter._id;
					flag = !quarter.isArchived;
				}
			})
			this.props.myStateActions.archiveMyQuarter(quarterId, flag);
		}
		//console.log(this.props.myState);
	}

	changeKeyResultScore(objectiveId, mentorId) {
		let apiCall = this.props.myStateActions.changeKeyResultScore;

		return (keyResultId) => {
			return (score) => {
				if (!isCorrectId(objectiveId)
					|| !isCorrectId(keyResultId)) {
					return;
				}

				let body = {
					keyResultId: keyResultId,
					score: score
				};
				if (mentorId != undefined)
					apiCall(objectiveId, body, notifications.notificationApprenticeUpdateKey, mentorId);
				else
					apiCall(objectiveId, body);
			};
		};
	}

	createObjective(categoryId) {
		return (title, objectiveId) => {
			let quarters;
			let userId;
			let selectedYear;
			let selectedTab
			if (this.props.userId == undefined) {
				userId = session;
				quarters = this.props.myState.me.quarters;
				selectedYear = this.props.myState.selectedYear;
				selectedTab = this.props.myState.selectedTab;
			} else {
				userId = this.props.userId;
				quarters = this.props.user.user.quarters;
				selectedYear = this.props.user.selectedYear;
				selectedTab = this.props.user.selectedTab;
			}

			let quarter = quarters.find((quarter) => {
				return (quarter.index == selectedTab) && (quarter.year == selectedYear);
			});

			let body = {
				title: title,
				objectiveId: objectiveId,
				categoryId: categoryId,
				quarterId: quarter._id,
				userId: userId,
			};
			if (this.props.userId == undefined) {
				if (this.props.mentorId != undefined)
					this.props.myStateActions.addNewObjective(body, notifications.notificationApprenticeAddedObjective, this.props.mentorId);
				else
					this.props.myStateActions.addNewObjective(body);
			} else {
				this.props.otherPersonActions.addNewObjective(body);
			}
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
		const userId = this.props.userId;
		const displayedCategories = this.props.categories.list.filter((category) => {
			return !category.isDeleted;
		});
		const { me } = this.props.myState;
		const { user } = this.props.user;
		let selectedYear = '';
		let selectedTab = '';
		let userInfo = {};

		// Edit key result on HomePage or UserPage
		let editKeyResult = {};

		// If you need to know is it user HomePage "/" or UserPage "/user/:id" - use this variable
		let isItHomePage;
		let archived;
		let isAdmin = this.props.myState.me.localRole === "admin" ? true : false;

		if ((user._id != undefined) && (userId != undefined) && (user._id == userId)) {
			/*console.log('user');*/
			isItHomePage = false;
			selectedYear = this.props.user.selectedYear;
			selectedTab = this.props.user.selectedTab;
			userInfo = getObjectivesData(user, selectedYear, selectedTab);

			// Edit key result on UserPage
			editKeyResult = {
				id: this.props.user.editKeyResultId,
				isEditing: this.props.user.editKeyResultIsEditing,
				enableEdit: this.props.otherPersonActions.editKeyResultEnableEditOnUserPage,
				disableEdit: this.props.otherPersonActions.editKeyResultDisabledEditOnUserPage,
				editTitleAndDifficulty: this.props.otherPersonActions.editKeyResultEditTitleAndDifficulty,
			};
		} else {
			/*console.log('me');*/
			isItHomePage = true;
			selectedYear = this.props.myState.selectedYear;
			selectedTab = this.props.myState.selectedTab;
			userInfo = getObjectivesData(me, selectedYear, selectedTab);

			// Edit key result on HomePage
			editKeyResult = {
				id: this.props.myState.editKeyResultId,
				isEditing: this.props.myState.editKeyResultIsEditing,
				enableEdit: this.props.myStateActions.editKeyResultEnableEditOnHomePage,
				disableEdit: this.props.myStateActions.editKeyResultDisabledEditOnHomePage,
				editTitleAndDifficulty: this.props.myStateActions.editKeyResultEditTitleAndDifficulty,
			};
		}

		if (( CONST.currentYear < selectedYear ||
				( CONST.currentQuarter <= selectedTab && CONST.currentYear == selectedYear )) &&
				( isItHomePage || session == userInfo.mentorId || userId == session )) {
			archived = false;
		} else {
			archived = true;
		}

		return (
			<div id="home-page-wrapper">
				<Quarterbar
						changeTab={ this.changeTab }
						changeYear={ this.changeYear }
						selectedYear= { selectedYear }
						selectedTab={ selectedTab }
				    	addNewQuarter={ this.handleAddingNewQuarter }
				    	archiveQuarter={this.handleArchivingQuarter }
						quarters={ userInfo.quarters }
						isAdmin={ isAdmin }
						me={ isItHomePage }
						mentorId = { userInfo.mentorId } />
				<div id='objectives'>
					<ObjectivesList
						mentorId={userInfo.mentorId}
						categories={ displayedCategories }
						isAdmin={ isAdmin }
						archived = { archived }
						objectives={ userInfo.objectives }
						selectedYear= { selectedYear }
						selectedTab={ selectedTab }
						ObjectiveItem={ ObjectiveItem }
						changeArchive={ this.handleArchive }
						updateUserObjectiveApi= { this.props.myStateActions.updateUserObjectiveApi }
						softDeleteMyObjectiveByIdApi={ this.props.myStateActions.softDeleteMyObjectiveByIdApi }
						changeKeyResultScore={ this.changeKeyResultScore }
						createObjective={ this.createObjective }
						getObjectiveAutocompleteData={ this.getObjectiveAutocompleteData }
						softDeleteObjectiveKeyResultByIdApi={ this.props.myStateActions.softDeleteObjectiveKeyResultByIdApi }
						isItHomePage={ isItHomePage }
						editKeyResult = { editKeyResult }
						addNewKeyResults = { this.props.keyResultActions.addNewKeyResults }
						getAutocompleteKeyResults = { this.props.keyResultActions.getAutocompleteKeyResults }
						setAutocompleteKeyResultsSelectedItem = { this.props.keyResultActions.setAutocompleteKeyResultsSelectedItem }
					/>
				</div>
			</div>
		)
	}
}

Objectives.defaultProps = { today: new Date() };

function getObjectivesData(userObject, selectedYear, selectedTab) {
	let quarters = [];
	let objectives = [];
	let id = userObject._id;
	let mentor;

	if(userObject.mentor != undefined || userObject.mentor != null)
		mentor = userObject.mentor._id;
	//console.log('userObject', userObject)
	if (userObject.quarters != undefined) {
		var current_quarter = userObject.quarters.find((quarter) => {
			return (quarter.year == selectedYear) && (quarter.index == selectedTab)
		});

		if(current_quarter != undefined) {
			objectives = current_quarter.userObjectives;
		} else {
			objectives = []
		}

		quarters = userObject.quarters.filter(quarter => {
			return quarter.year == selectedYear;
		});
	}

	return {
		quarters: quarters,
	  objectives: objectives,
	  id: id,
	  mentorId: mentor
	};
}

function mapDispatchToProps(dispatch) {
	return {
		keyResultActions: bindActionCreators(keyResultActions, dispatch),
		myStateActions: bindActionCreators(myStateActions, dispatch),
		objectiveActions: bindActionCreators(objectiveActions, dispatch),
		otherPersonActions : bindActionCreators(otherPersonActions, dispatch),
		userDashboardActions: bindActionCreators(userDashboardActions, dispatch)
	}
}

function mapStateToProps(state) {
	return {
		myState: state.myState,
		categories: state.categories,
		user: state.userPage,
	};
}

const ObjectivesConnected = connect(mapStateToProps, mapDispatchToProps)(Objectives);

export default ObjectivesConnected;
