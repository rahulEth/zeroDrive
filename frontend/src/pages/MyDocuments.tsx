import { useEffect, useState } from "react";
import { Table } from "../components/Table";
import { Search } from "../components/Search";
import { getEncryptedDataByType } from "../modules/api";
import { useAccount } from "wagmi";
import type { GetEncryptedDataResponse } from "../interfaces";

import { documentTypes } from "../constants/ui";

export const MyDocuments = ({ reloadData }: { reloadData: boolean }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchString, setSearchString] = useState("");
	const account = useAccount();

	const [documentType, setDocumentType] = useState<string>("all");

	const [myDocuments, setMyDocuments] = useState<GetEncryptedDataResponse[]>(
		[],
	);

	const handleSearch = (search: string) => {
		setSearchString(search);
		setMyDocuments(
			myDocuments.filter((doc) => doc.fileName.toLowerCase().includes(search)),
		);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const fetchMyDocuments = async (address: string) => {
			setIsLoading(true);
			try {
				const response = await getEncryptedDataByType(address, documentType);
				setMyDocuments(response);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		if (account) {
			fetchMyDocuments(account.address as string);
		}
	}, [account.address, documentType, reloadData]);

	return (
		<div className="flex flex-col">
			<h2 className="text-2xl font-bold dark:text-white">My Documents</h2>
			<div className="mb-5">
				<div className="flex gap-4 items-center">
					<label className="block" htmlFor="documentType">
						Filter by Document Type
					</label>
					<select
						id="documentType"
						name="documentType"
						className="border border-solid p-2 rounded-lg"
						value={documentType}
						onChange={(e) => setDocumentType(e.target.value)}
					>
						{documentTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="mb-5">
				<Search
					onSearch={handleSearch}
					searchString={searchString}
					setSearchString={setSearchString}
				/>
			</div>

			<Table data={myDocuments} isMine={true} isLoading={isLoading} />
		</div>
	);
};
