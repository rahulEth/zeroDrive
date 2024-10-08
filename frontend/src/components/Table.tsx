import { useState } from "react";
import type {
	GetEncryptedDataResponse,
	GetDocumentResponse,
} from "../interfaces";
import { formatDate } from "../utils/dateUtils";
import { SendFileBtn } from "./SendFileBtn";
import { DetailsModal } from "./DetailsModal";
import { useAccount } from "wagmi";
import { truncateEthAddress } from "../utils/truncateAddress";

export const Table = ({
	data,
	isMine,
	isLoading,
}: {
	data: GetEncryptedDataResponse[] | GetDocumentResponse[];
	isLoading: boolean;
	isMine?: boolean;
}) => {
	const account = useAccount();
	const [isDetailsModalVisible, setIsDetailsModalVisible] =
		useState<boolean>(false);

	const [isVerifyModalVisible, setIsVerifyModalVisible] =
		useState<boolean>(false);

	const [fileData, setFileData] = useState<{
		encryptedData: string;
		filename: string;
	} | null>(null);

	const openDetailsModal = (id: string) => {
		const document = data.find((doc) => doc._id === id);
		if (document) {
			setFileData({
				encryptedData: document.encryptedData,
				filename: document.fileName,
			});

			setIsDetailsModalVisible(true);
		}
	};

	return (
		<>
			<table className="table-auto border border-gray-300 border-collapse rounded-lg">
				<thead>
					<tr>
						<th className="px-4 py-2 border border-gray-300 rounded-lg dark:text-white">
							Name
						</th>
						<th className="px-4 py-2 border border-gray-300 rounded-lg dark:text-white">
							Type
						</th>

						{!isMine && (
							<th className="px-4 py-2 border border-gray-300 rounded-lg dark:text-white">
								From
							</th>
						)}
						{isMine && (
							<th className="px-4 py-2 border border-gray-300 rounded-lg dark:text-white">
								Proof
							</th>
						)}
						<th className="px-4 py-2 border border-gray-300 rounded-lg dark:text-white">
							Date
						</th>
						{isMine ? (
							<th className="px-4 py-2  border border-gray-300 rounded-lg dark:text-white">
								Notary Approval
							</th>
						) : (
							<th className="px-4 py-2  border border-gray-300 rounded-lg dark:text-white">
								Verify
							</th>
						)}
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<tr>
							<td className="border px-4 py-2 border-gray-300" colSpan={5}>
								Loading...
							</td>
						</tr>
					) : data.length ? (
						data.map((item) => (
							<tr key={item._id}>
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<td
									className="border cursor-pointer px-4 py-2 border-gray-300 rounded-lg text-center dark:hover:text-white"
									onClick={() => (isMine ? openDetailsModal(item._id) : null)}
								>
									{item.fileName}
								</td>

								<td className="border px-4 py-2 border-gray-300 rounded-lg text-center">
									{item.dataType}
								</td>

								{isMine && (
									<td className="border px-4 py-2 border-gray-300 rounded-lg text-center">
										<a
											href={item.txHash}
											target="_blank"
											rel="noreferrer"
											className="underline dark:hover:text-white"
										>
											Link to hashscan
										</a>
									</td>
								)}

								{!isMine && (
									<td className="border px-4 py-2 border-gray-300 rounded-lg text-center">
										{truncateEthAddress(item.fromAddr)}
									</td>
								)}

								<td className="border px-4 py-2 border-gray-300 rounded-lg text-center">
									{formatDate(item.date)}
								</td>

								{isMine ? (
									<td className="border px-4 py-2 border-gray-300 rounded-lg text-center">
										<SendFileBtn
											document={{
												fileName: item.fileName,
												dataType: item.dataType,
												fileData: item.encryptedData,
											}}
										/>
									</td>
								) : (
									<td className="border px-4 py-2 border-gray-300 rounded-lg text-center">
										<a
											href={item.signHash}
											target="_blank"
											rel="noreferrer"
											className="underline dark:hover:text-white"
										>
											Link to hashscan
										</a>
									</td>
								)}
							</tr>
						))
					) : (
						<tr>
							<td className="border px-4 py-2 border-gray-300" colSpan={5}>
								{account.status === "connected"
									? "No documents found"
									: "Connect your account to view documents"}
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{isDetailsModalVisible && fileData && (
				<DetailsModal
					close={() => setIsDetailsModalVisible(false)}
					encryptedData={fileData.encryptedData}
					fileName={fileData.filename}
				/>
			)}
		</>
	);
};
