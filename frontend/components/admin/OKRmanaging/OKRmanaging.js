import React, { Component } from 'react';
import CentralWindow from "../../../containers/central-window.jsx";
import ObjectiveList from './components/ObjectiveList';
import ActiveObjective from './components/ActiveObjective';
import Searchbar from './components/SearchBar';
import Toolbar from './components/Toolbar';
import StatPanel from "../../../containers/statistic-panel.jsx";

import './OKRmanaging.scss';

class OKRmanaging extends Component {
  constructor(props) {
    super(props); 
  }

render() {

    return (
    	<div>
    	<CentralWindow>
			<div className="OKR-managing app container">
				<div className="OKR-managing fixed-header">
					<div className="OKR-managing search">
						<Searchbar />
					</div>
					<div id="OKR-managing-title"> 
						<p><span>Template management</span></p>
					</div>
				</div>			

				<div className="OKR-managing objective-list">
					<ObjectiveList />
				</div>
			</div>
		</CentralWindow>
		<StatPanel>
			<div className="OKR-mnaging active objective">
				<ActiveObjective />
			</div>
		</StatPanel>
		</div>

    );
  }
}

export default OKRmanaging
