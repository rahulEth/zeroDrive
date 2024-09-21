import { useState } from "react";
import { type Document, Table } from "../components/Table";

export const ReceivedDocuments = () => {
	const [receivedDocuments, setReceivedDocuments] = useState<Document[]>([]);
	return (
		<div className="flex flex-col">
			<h1 className="text-4xl font-bold">Received Documents</h1>
			<div className="text-lg my-4">
				This is a list of all documents you have received
			</div>
			<Table data={receivedDocuments} />
		</div>
	);
};
