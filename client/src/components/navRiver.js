import React from "react";

import "bootstrap/dist/css/bootstrap.css";

import ganaraskaLogo from '../assets/ganaraska.jpg'
import creditLogo from '../assets/credit.jpg'

import { NavLink } from "react-router-dom";

export default function NavRiver() {
	return (
	<div className="wrapper">
		<p>RiverWatcher + Hydrometric Data</p>
		<nav>
			<div className="river-container">
				<NavLink className="ganaraska-nav" to="/ganaraska">
					<img src={ganaraskaLogo} ></img>
				</NavLink>
				<p>Ganaraska River</p>
			</div>
			<div className="river-container">
				<NavLink className="credit-nav" to="/credit">
					<img src={creditLogo}></img>
				</NavLink>
				<p>Credit River</p>
			</div>
		</nav>
	</div>
	);
}
