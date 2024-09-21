import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export const Sidebar = () => {
	return (
		<aside className="w-64 bg-gray-800 text-white flex flex-col">
			<nav className="flex-1 px-4 py-4 space-y-4">
				<h2 className="text-accent font-bold">Your data - your control</h2>
				<h5 className="text-primary-dark">Trustless and Non-Custodial security </h5>
				<ul>
					{ROUTES.map((route) => (
						<li key={route.path} className="py-3 border-b-2">
							<Link to={route.path}>{route.name}</Link>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
};
