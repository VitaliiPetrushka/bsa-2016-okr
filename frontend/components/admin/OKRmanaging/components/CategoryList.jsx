import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CategoryItem from './CategoryItem.jsx'
import NewCategory from './Category-add.jsx'

import * as categoriesActions from "../../../../actions/categoriesActions.js";
import * as okrManagingActions from "../../../../actions/okrManagingActions.js";

class CategoryList extends Component {
	constructor(props){
		super(props);

		this.onDelete = this.onDelete.bind(this);
		this.addNewCategory = this.addNewCategory.bind(this);
  }

	addNewCategory() {
			this.props.categoriesActions.cancelEdit();
			this.props.okrManagingActions.cancelEdit();

			let categoryAddBtn = this.refs.newCategoryButton;
			let categoryAddElement = this.refs.newCategoryButton.nextElementSibling;

			if (categoryAddElement.classList.contains('undisplay')) {
				categoryAddElement.classList.remove('undisplay');
				categoryAddElement.classList.add('display');
			}

			if (categoryAddBtn.classList.contains('display')) {
				categoryAddBtn.classList.remove('display');
				categoryAddBtn.classList.add('undisplay');
			}
		}

		onDelete() {
			let categoryAddBtn = this.refs.newCategoryButton;
			let categoryAddElement = this.refs.newCategoryButton.nextElementSibling;

			if (categoryAddElement.classList.contains('display')) {
				categoryAddElement.classList.remove('display');
				categoryAddElement.classList.add('undisplay');
			}

			if (categoryAddBtn.classList.contains('undisplay')) {
				categoryAddBtn.classList.remove('undisplay');
				categoryAddBtn.classList.add('display');
			}
		}

		componentWillMount(){
			this.props.categoriesActions.cancelEdit();
		}

render() {
	return(
		<div>
			<p>
				<span>Categories</span>
			</p>
			<ul className='category-list'>
			{this.props.category.list.map((item, index) => {
				return <CategoryItem index = { index } 
														 category = { item } 
														 key = { index } 
														 categories = { this.props.category } 
														 objectives = { this.props.objectives } 
														 editCategory = { this.props.categoriesActions.editCategory }
														 activeCategory = { this.props.categoriesActions.activeCategory }
														 cancelEdit = { this.props.categoriesActions.cancelEdit }
														 deleteCategory = { this.props.categoriesActions.deleteCategory }
														 onDeleteNewCategory = { this.onDelete }
								/>
			})}
			</ul>
			<div id="new-category">
						<a ref="newCategoryButton" className='add-new-category-btn display' onClick={this.addNewCategory}>
							+Add new category</a>
						<NewCategory  category = { this.props.category }
													addCategory = { this.props.categoriesActions.addCategory }
													onDelete = { this.onDelete } 
						/>
			</div>
		</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		categoriesActions: bindActionCreators(categoriesActions, dispatch),
		okrManagingActions: bindActionCreators(okrManagingActions, dispatch),
	}
}

function mapStateToProps(state) {
	return {
		category: state.categories,
		objectives: state.okrManaging.objectives
	};
}

const CategoryListConnected = connect(mapStateToProps, mapDispatchToProps)(CategoryList);
export default CategoryListConnected

