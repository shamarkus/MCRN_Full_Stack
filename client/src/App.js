import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import NavRiver from "./components/navRiver";
import Credit from "./components/credit";
import Ganaraska from "./components/ganaraska";

const App = () => {
	return (
		<div>
			<Routes>
				<Route exact path="/" element={<NavRiver/>} />
				<Route path="/Ganaraska" element={<Ganaraska />} />
				<Route path="/Credit" element={<Credit />} />
			</Routes>
		</div>
	);
};

export default App;
