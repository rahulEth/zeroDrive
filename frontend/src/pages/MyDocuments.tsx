import { useEffect, useState } from "react";
import { type Document, Table } from "../components/Table";
import { Search } from "../components/Search";
import { getDocuments, getEncryptedDataByType } from "../modules/api";
import { useAccount } from "wagmi";
import type { GetEncryptedDataResponse } from "../interfaces";

const DOCUMENT_TYPES = [
	"personal",
	"education",
	"health",
	"government",
	"identity",
	"all",
];

export const MyDocuments = ({ reloadData }: { reloadData: boolean }) => {
	const [searchString, setSearchString] = useState("");
	const account = useAccount();
	const [myDocuments, setMyDocuments] = useState<GetEncryptedDataResponse[]>(
		[],
	);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [documentType, setDocumentType] = useState<string>("all");

	const handleSearch = (search: string) => {
		console.log(search);
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
			<h2 className="text-2xl font-bold text-white">My Documents</h2>
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
						{DOCUMENT_TYPES.map((type) => (
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
