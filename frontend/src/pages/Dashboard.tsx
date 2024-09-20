import { useState } from "react";
import UploadComponent from "../components/Upload";
import { MyDocuments } from "./MyDocuments";

export const Dashboard = () => {
	const [currentFile, setFile] = useState<string | null>(null);
	const loadFile = (base64: string) => {
		setFile(base64);
	};
	return (
		<div className="flex flex-col h-full">
			<h1 className="text-4xl font-bold">Welcome to ZeroDrive</h1>
			<h2>Your data your control</h2>
			<h5>Trustless and Non-Custodial security </h5>
			<p className="text-lg mt-4">
				This is a decentralized file storage application
			</p>

			<UploadComponent saveBase64={loadFile} />

			<MyDocuments />
		</div>
	);
};
