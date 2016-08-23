import React from 'react';
import './home-page/home-page.scss';
import './common/styles/scrollbar.scss';
import ListOfUsers from './list-of-users/list-of-users.jsx';
import Quarter from './home-page/quarter.jsx';
import UserObjectives from './home-page/objectives.jsx';
import CentralWindow from '../containers/central-window.jsx';
import StatPanel from "../containers/statistic-panel.jsx";
import Dashboard from "./dashboard/dashboard.jsx";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from "../actions/categoriesListActions";

class Home extends React.Component {
	constructor() {
		super();
	}

	componentWillMount() {
		this.props.getAllCategories();
	}

	render() {
		return (
			<div>
				<CentralWindow>
				<UserObjectives />
				</CentralWindow>
				<StatPanel>
				<Dashboard />
				</StatPanel>
			</div>
			)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
	return {
		stateFromReducer: state
	};
}

const HomeConnected = connect(mapStateToProps, mapDispatchToProps)(Home);

export default HomeConnected;
