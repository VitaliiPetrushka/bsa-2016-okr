import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from "../../../actions/mappingActions";

import './role-mapping.scss';

const CONST = require("../../../../backend/config/constants");

class RoleMappingItem extends React.Component {

   render() {

   	   if (this.props.role.globalRole === CONST.user.globalRole.ADMIN) {

		   		return (
		   			<div className="table-row">
			   			<h4 className="col-1">{this.props.role.globalRole}</h4>
			   			<h4 className="col-2">Admin</h4>
			   		 </div>
		   		);
		   	}
		   	  return (
	            <div className="table-row" >
	                   <h4 className="col-1">{this.props.role.globalRole}</h4>
	                   <select className="col-2" id={"roles" + this.props.role._id}  onChange={this.changeLocalRole.bind(this)} ref="localRole" defaultValue="">
			             <option value={CONST.user.localRole.USER}>User</option>
			             <option value={CONST.user.localRole.ADMIN}>Admin</option>
			           </select>
	            </div>	            
            );
   }

   changeLocalRole() {

      let reqBody = {};
      reqBody.globalRole = this.props.role.globalRole;
      reqBody.localRole = this.refs.localRole.value;

	   	this.props.updateGlobalRole(this.props.role._id, reqBody);
   }

   componentDidMount()  {


   	 let adminOption = document.querySelector("select#roles" + this.props.role._id + " option[value=" + CONST.user.localRole.ADMIN + "]");
   	 let userOption = document.querySelector("select#roles" + this.props.role._id + " option[value=" + CONST.user.localRole.USER + "]");

   	 if (this.props.role.localRole === CONST.user.localRole.ADMIN) {
   	 	if (adminOption != undefined)
	   	 	adminOption.selected = true;
   	 }
   	 else {
   	 	if (userOption != undefined)
	   	 	userOption.selected = true;
   	 }
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

const RolesMappingItem = connect(mapStateToProps, mapDispatchToProps)(RoleMappingItem);
export default RolesMappingItem