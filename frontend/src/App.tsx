import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ROUTES } from "./constants/routes";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<div className="w-full test">
			<Header />
			<div
				className="flex justify-center h-screen"
				style={{ maxHeight: "calc(100vh - 73px)" }}
			>
				<Sidebar />
				<main className="flex-1 bg-white p-8 max-h-[100vh] overflow-auto">
					<Routes>
						{ROUTES.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={route.component()}
							/>
						))}
					</Routes>
				</main>
			</div>
		</div>
	);
}

export default App;
