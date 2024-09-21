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

export const Dashboard = () => {
	const [fileBase64, setFileBase64] = useState<string | null>(null);
	const account = useAccount();

	const { signMessageAsync, data, status } = useSignMessage();

	const loadFile = (base64: string) => {
		setFileBase64(base64);
	};

	const handleSign = async (fileName: string) => {
		const signatureHash = await signMessageAsync({ message: fileName });
		if (!signatureHash) return;
		if (!fileBase64) return;

		const encryptedData = encryptData(fileBase64, signatureHash); // data to encrypt, secret key
		const base64EncodedData = encodeBase64(encryptedData);
		console.log("Encrypted and Base64 encoded data:", base64EncodedData);

		const decodedData = decodeBase64(base64EncodedData);
		const decryptedData = decryptData(decodedData, signatureHash);
		console.log("Decrypted data:", decryptedData);
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
				<UploadComponent saveBase64={loadFile} onSign={handleSign} />
			</div>

			<MyDocuments />
		</div>
	);
};
