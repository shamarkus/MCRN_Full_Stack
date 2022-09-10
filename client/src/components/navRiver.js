import React from "react";

import "bootstrap/dist/css/bootstrap.css";

import { NavLink } from "react-router-dom";

export default function NavRiver() {
	return (
	<div className="wrapper">
		<nav>
			<div className="ganaraska-container">
				<NavLink className="ganaraska-nav" to="/ganaraska">
					<img ></img>
				</NavLink>
				<p> ganaraska </p>
			</div>
			<div className="credit-container">
				<NavLink className="credit-nav" to="/credit">
					<img ></img>
				</NavLink>
				<p> credit  </p>
			</div>
		</nav>
	</div>
	);
}
