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

export const Dashboard = () => {
	const [fileBase64, setFileBase64] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string>("");
	const [documentType, setDocumentType] = useState<DocumentType | "">("");
	const account = useAccount();
	const [signatureHash, setSignatureHash] = useState<string | null>(null);

	const { signMessageAsync, data, status } = useSignMessage();

	const loadFile = (base64: string) => {
		setFileBase64(base64);
	};

	const handleSign = async (fileName: string) => {
		const signatureHash = await signMessageAsync({ message: fileName });
		setFileName(fileName);
		setSignatureHash(signatureHash);

		// const decodedData = decodeBase64(base64EncodedData);
		// const decryptedData = decryptData(decodedData, signatureHash);
		// console.log("Decrypted data:", decryptedData);
	};

	const sendFile = async () => {
		if (!signatureHash || !documentType || !fileBase64) return;

		const encryptedData = encryptData(fileBase64, signatureHash); // data to encrypt, secret key
		const base64EncodedData = encodeBase64(encryptedData);
		console.log("Encrypted and Base64 encoded data:", base64EncodedData);
		sendDocument({
			address: account?.address as string,
			fileName,
			encryptedData: base64EncodedData,
			datatype: documentType,
			chainType: "hedera",
		});
	};

	return (
		<div className="flex flex-col h-full">
			<h1 className="text-4xl font-bold">Welcome to ZeroDrive</h1>
			<h2>Your data your control</h2>
			<h5>Trustless and Non-Custodial security </h5>
			<p className="text-lg mt-4">
				This is a decentralized file storage application
			</p>

			<div className="mb-4">
				<div className="text-xl font-bold mb-4">Load and save your file</div>
				<UploadComponent saveBase64={loadFile} onSign={handleSign} />
				{fileBase64 && signatureHash && (
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
								{documentTypes.map((type) => (
									<option key={type} value={type}>
										{type.charAt(0).toUpperCase() + type.slice(1)}
									</option>
								))}
							</select>

							<button
								type="button"
								className="btn-default py-2 px-4 rounded-lg"
								onClick={sendFile}
								disabled={!documentType}
							>
								Send file
							</button>
						</div>
					</div>
				)}
			</div>

			<MyDocuments />
		</div>
	);
};
