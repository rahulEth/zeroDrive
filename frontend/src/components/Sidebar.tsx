import { NavLink } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export const Sidebar = () => {
	return (
		<aside className="w-64 dark:bg-primary-transparent bg-primary text-white flex flex-col">
			<nav className="flex-1 px-4 py-4 space-y-4">
				<h2 className="text-accent font-bold">Your data - your control</h2>
				<h5 className="text-gray-300">
					Trustless and Non-Custodial security
				</h5>
				<ul>
					{ROUTES.map((route) => (
						<li key={route.path} className="py-3 border-b-2">
							<NavLink
								to={route.path}
								className={({ isActive }) =>
									isActive ? "text-accent font-bold" : ""
								}
							>
								{route.name}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
};
