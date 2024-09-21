import { useEffect, useState } from "react";
import { Table } from "../components/Table";
import { getReceivedDocs } from "../modules/api";
import { useAccount } from "wagmi";

import type { GetDocumentResponse } from "../interfaces";

export const ReceivedDocuments = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const account = useAccount();

	const [receivedDocuments, setReceivedDocuments] = useState<
		GetDocumentResponse[]
	>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetchReceivedDocuments = async (address: string) => {
			setIsLoading(true);
			try {
				const response = await getReceivedDocs(address);
				setReceivedDocuments(response);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		if (account) {
			fetchReceivedDocuments(account.address as string);
		}
	}, [account.address]);

	return (
		<div className="flex flex-col">
			<h1 className="text-4xl font-bold dark:text-white mb-4">Received Documents</h1>
			<Table data={receivedDocuments} isLoading={isLoading} />
		</div>
	);
};
