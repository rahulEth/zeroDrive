import { Dashboard } from "../pages/Dashboard";
import { MyDocuments } from "../pages/MyDocuments";
import { ReceivedDocuments } from "../pages/ReceivedDocuments";

export const ROUTES = [
	{
		path: "/",
		name: "Dashboard",
		component: () => <Dashboard />,
	},
	{
		path: "/my-documents",
		name: "My Documents",
		component: () => <MyDocuments />,
	},
	{
		path: "/received-documents",
		name: "Received Documents",
		component: () => <ReceivedDocuments />,
	},
];
