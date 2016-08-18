import React, { Component } from 'react';
import DeletedTmplsItem from './DeletedTmplsItem';
import StatPanel from '../../../containers/statistic-panel.jsx';
import CentralWindow from "../../../containers/central-window.jsx";
import RecycleBinFilter from './RecycleBinFilters';
import '../../common/styles/table.scss';
import './recycleBin.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from "../../../actions/recycleBinActions.js";

class RecycleBin extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		let deleted_items = this.props.recycleBin.recycleBinItems.map((item) => {
			return <DeletedTmplsItem item={item} key={item.id} />
		});
		return (
			<div>
				<CentralWindow>
					<h1>Recycle Bin</h1>
					<div className="filter-box clearfix">
						<div>
							<input type="checkbox" id="cbObjectives" defaultChecked={true}></input>
							<label htmlFor="cbObjectives">Objectives</label>
						</div>
						<div>
							<input type="checkbox" id="cbKey"></input>
							<label htmlFor="cbKey">Key</label>
						</div>
						<div>
							<input type="checkbox" id="cbCategory"></input>
							<label htmlFor="cbCategory">Category</label>
						</div>
						<div>
							<input type="checkbox" id="cbUser"></input>
							<label htmlFor="cbUser">User</label>
						</div>
						<div className="recucle-bin-filter-bar-container">
							<RecycleBinFilter/>
						</div>
					</div>
					<div>
						<table className='table'>
							<thead>
								<tr>
									<th>Type</th>
									<th>Category</th>
									<th>Title</th>
									<th>Description</th>
									<th>Deleted By</th>
									<th>Date</th>
									<th className="actions">actions</th>
								</tr>
							</thead>
							<tbody>
								{ deleted_items }
							</tbody>
						</table>
					</div>
				</CentralWindow>
				<StatPanel></StatPanel>
			</div>
		);
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

const RecycleBinConnected = connect(mapStateToProps, mapDispatchToProps)(RecycleBin);
export default RecycleBinConnected