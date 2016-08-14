import React from 'react';
import { Link } from 'react-router';
import "./nav-menu.scss";

class NavMenu extends React.Component {
	constructor(props) {
		super(props);
	}

	links_feedback_handler(event) {
		links_feedback(event);
	}

	render() {
		return (
			<aside id="navbar">
				<nav onClick={this.links_feedback_handler.bind(this)}>
					<ul>
						<li>
							<Link to="/">
								<i className="fa fa-home fa-2x" aria-hidden="true"></i>
								Home
							</Link>
						</li>
						<li>
							<Link to="/users">
								<i className="fa fa-users fa-2x" aria-hidden="true"></i>
								Users
							</Link>
						</li>
						<li>
							<Link to="/history">
								<i className="fa fa-clock-o fa-2x" aria-hidden="true"></i>
								History
							</Link>
						</li>
						<li>
							<Link to="/recycle-bin">
								<i className="fa fa-recycle fa-2x" aria-hidden="true"></i>
								Recycle Bin
							</Link>
						</li>
						<li>
							<Link to="/roles">
								<i className="fa fa-server fa-2x" aria-hidden="true"></i>
								Role mapping
							</Link>
						</li>
					</ul>
				</nav>
			</aside>
		)
	}
}
export default NavMenu;

function links_feedback(event) {
	var   target = event.target,
			links = document.querySelectorAll('#navbar a'),
			nav = document.getElementById('navbar');

	if(target.matches('#navbar a')){

		if(!isActive(target)){
         disactiveAll(links);
         switch_state(target, 'active');
         if(isOpen(nav)) close_nav();
      }
   } else if(target.matches('#navbar #users-link')){

		if(isOpen(nav)) close_nav();
   }
}
function disactiveAll(target) {
	target.forEach((el) => {
		el.classList.remove('active');
	})
}
function isActive(target) {
	return target.classList.contains('active');
}
function isOpen(target) {
	return target.classList.contains('opened');
}
function switch_state(target, action) {
	if (action === 'active'){
		target.classList.add('active');
	} else if (action === 'disactive') {
		target.classList.remove('active');
	} else if (action === 'open'){
		target.classList.add('opened');
	} else if (action === 'close'){
		target.classList.remove('opened');
	}
}
function close_nav() {
	var   nav = document.getElementById('navbar'),
			menu_bars = document.getElementById('bars');

	switch_state(nav, 'close');
	switch_state(menu_bars, 'disactive');
}

