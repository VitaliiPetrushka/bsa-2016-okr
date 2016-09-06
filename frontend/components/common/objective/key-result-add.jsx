import React from 'react';
import AutocompleteInput from '../../autocomplete-input/autocomplete-input.jsx';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from "../../../actions/keyResultActions";

class KeyResult extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};

		this.resetAutocompleteState = this.resetAutocompleteState.bind(this);
		this.getAutocompleteData = this.getAutocompleteData.bind(this);
		this.setAutocompleteSelectedItem = this.setAutocompleteSelectedItem.bind(this);
		this.addNewItem = this.addNewItem.bind(this);
		this.isValid = this.isValid.bind(this);
	}

	addNewItem(title) {
		if (title !== '') {
			const body = {
				title: title,
				keyResultId: this.props.keyResultsReducer.selectedItem._id || '',
			};

			let userObjectiveId = this.props.objectiveId;

			this.props.addNewKeyResults(userObjectiveId, body);
			this.props.resetAutocompleteState();
		}
	};

	resetAutocompleteState() {
		this.props.resetAutocompleteState();
	}

	getAutocompleteData(title) {
		let objectiveId = this.props.objectiveId;
		this.props.getAutocompleteKeyResults(objectiveId, title);
	}

	setAutocompleteSelectedItem(item) {
		this.props.setAutocompleteKeyResultsSelectedItem(item);
	}

	isValid(value) {
		return true;
	}

	render() {
		return (
			<section className="autocomplete undisplay">
				<AutocompleteInput
					getAutocompleteData={ this.getAutocompleteData }
					setAutocompleteSelectedItem={ this.setAutocompleteSelectedItem }
					autocompleteData={ this.props.keyResultsReducer.data }
					autocompletePlaceholder='key result'
					addNewItem={ this.addNewItem }
					resetAutocompleteState={ this.resetAutocompleteState }
				  isValid={ this.isValid }
					selectedItem={ this.props.keyResultsReducer.selectedItem }
				  ref={ `autocompleteInput-${this.props.objectiveId}` }
				/>
			</section>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
	return {
		keyResultsReducer: state.keyResults
	};
}

const KeyResultConnected = connect(mapStateToProps, mapDispatchToProps)(KeyResult);

export default KeyResultConnected;