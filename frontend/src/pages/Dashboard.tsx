import { useState } from "react";
import UploadComponent from "../components/Upload";
import { MyDocuments } from "./MyDocuments";
import { useAccount, useSignMessage } from "wagmi";

import {
	encryptData,
	encodeBase64,
	decodeBase64,
	decryptData,
} from "../utils/aes";
import { sendDocument } from "../modules/api";
import { documentTypes } from "../constants/ui";
import type { DocumentType } from "../interfaces";
import { SuccessModal } from "../components/SuccessModal";

interface DocumentData {
	fileName: string;
	base64: string;
}

export const Dashboard = () => {
	const account = useAccount();
	const { signMessageAsync, data, status } = useSignMessage();

	const [documentHash, setDocumentHash] = useState<string>("");
	const [documentData, setDocumentData] = useState<DocumentData | null>(null);
	const [documentType, setDocumentType] = useState<DocumentType | "">("");
	const [signatureHash, setSignatureHash] = useState<string | null>(null);
	const [isSuccessModalVisible, setIsSuccessModalVisible] =
		useState<boolean>(false);
	const [fileIsSending, setFileIsSending] = useState<boolean>(false);

	const loadFile = (base64: string, fileName: string) => {
		setDocumentData({
			fileName,
			base64,
		});
	};

	const handleSign = async (fileName: string) => {
		const signatureHash = await signMessageAsync({ message: fileName });
		setSignatureHash(signatureHash);
	};

	const sendFile = async () => {
		if (!signatureHash || !documentType || !documentData?.base64) return;

		const encryptedData = encryptData(documentData.base64, signatureHash); // data to encrypt, secret key
		const base64EncodedData = encodeBase64(encryptedData);
		console.log("Encrypted and Base64 encoded data:", base64EncodedData);
		setFileIsSending(true);
		try {
			const response = await sendDocument({
				address: account?.address as string,
				fileName: documentData.fileName,
				encryptedData: base64EncodedData,
				dataType: documentType,
				chainType: "hedera",
			});
			console.log(response);
			setDocumentHash(response.ipfsHash[0].path);
			setIsSuccessModalVisible(true);
		} catch (error) {
			console.error(error);
		} finally {
			setFileIsSending(false);
		}
	};

	const onCloseSuccessModal = () => {
		setIsSuccessModalVisible(false);
		setDocumentData(null);
		setDocumentType("");
		setSignatureHash(null);
	};

	return (
		<div className="flex flex-col">
			<h1 className="text-4xl font-bold text-white">Welcome to ZeroDrive</h1>
			<p className="text-lg text-primary-light mb-4 font-bold">
				This is a decentralized file storage application
			</p>

			<div className="mb-4">
				<div className="text-xl font-bold mb-4 text-white">Load and save your file</div>
				<UploadComponent
					saveDocumentData={loadFile}
					onSign={handleSign}
					documentData={documentData}
				/>
				{documentData && signatureHash && (
					<div className="mt-4">
						<div className="text-l font-bold mb-4">2. Choose data type</div>
						<div className="flex gap-4 items-center">
							<select
								className="border border-solid p-2 rounded-lg"
								value={documentType}
								onChange={(e) =>
									setDocumentType(e.target.value as DocumentType)
								}
							>
								<option value="">Select document type</option>
								{documentTypes.map((type) => (
									<option key={type} value={type}>
										{type.charAt(0).toUpperCase() + type.slice(1)}
									</option>
								))}
							</select>

							<button
								type="button"
								className="btn-default py-2 px-4 rounded-lg w-[200px]"
								onClick={sendFile}
								disabled={!documentType}
							>
								{fileIsSending ? "Sending..." : "Send file"}
							</button>
						</div>
					</div>
				)}
			</div>

			<MyDocuments reloadData={isSuccessModalVisible} />

			{isSuccessModalVisible && (
				<SuccessModal close={onCloseSuccessModal} linkProof={documentHash} />
			)}
		</div>
	);
};
