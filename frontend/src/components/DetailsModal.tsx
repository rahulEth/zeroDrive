import { useMemo, useRef, useState } from "react";
import { useSignMessage } from "wagmi";
import { decodeBase64, decryptData } from "../utils/aes";
import { IconCheck } from "./Icons";
import useClickOutside from "../hooks/useClickOutside";
import { PDFDownloader } from "./PDFDownloader";

export const DetailsModal = ({
	close,
	encryptedData,
	fileName,
}: {
	close: () => void;
	encryptedData: string;
	fileName: string;
}) => {
	const { signMessageAsync, data, status } = useSignMessage();
	const [signatureHash, setSignatureHash] = useState<string | null>(null);
	const modalRef = useRef<HTMLDivElement>(null);
	useClickOutside(modalRef, () => close());

	const handleSign = async () => {
		const signatureHash = await signMessageAsync({ message: fileName });
		setSignatureHash(signatureHash);
	};

	const getBase64PDFData = () => {
		if (!signatureHash) return;
		const decodedData = decodeBase64(encryptedData);
		const decryptedData = decryptData(decodedData, signatureHash);
		console.log("Decrypted data:", decryptedData);
		return decryptedData;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const base64PDFData = useMemo(() => {
		try {
			return getBase64PDFData();
		} catch (error) {
			console.error("Error generating base64 PDF data:", error);
			return null;
		}
	}, [signatureHash]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
			<div className="bg-white p-8 rounded-lg w-[500px]" ref={modalRef}>
				<h2 className="text-2xl font-bold mb-2 text-primary-dark">
					Document details
				</h2>
				<p className="text-lg">File name: {fileName}</p>

				<div className="py-4 items-center">
					{signatureHash ? (
						<p className="text-lg text-green-500 flex gap-4 ">
							File signed <IconCheck />
						</p>
					) : (
						<div className="flex gap-4">
							<div>
								If you want to decode file data, please provide your approval
							</div>
							<button
								type="button"
								className="btn-default py-2 px-4 rounded-lg w-[200px]"
								onClick={handleSign}
							>
								Sign
							</button>
						</div>
					)}
				</div>

				{signatureHash && base64PDFData && (
					<PDFDownloader base64PDFData={base64PDFData} fileName={fileName} />
				)}

				<button
					type="button"
					className="btn-default mt-4 py-2 px-4 rounded-lg"
					onClick={() => close()}
				>
					Close
				</button>
			</div>
		</div>
	);
};
