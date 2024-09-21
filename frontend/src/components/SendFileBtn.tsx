import { memo, useMemo, useRef, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { sendDocumentToAddress } from "../modules/api";
import useClickOutside from "../hooks/useClickOutside";
import { decodeBase64, decryptData } from "../utils/aes";
import { IconCheck } from "./Icons";

type Doc = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[x: string]: any;
	fileName: string;
	fileData: string;
	dataType: string;
};

export const SendFileBtn = memo(({ document }: { document: Doc }) => {
	const { signMessageAsync, data, status } = useSignMessage();
	const [signatureHash, setSignatureHash] = useState<string | null>(null);
	const [documentIsSending, setDocumentIsSending] = useState(false);

	const [receiver, setReceiver] = useState("");
	const [documentSent, setDocumentSent] = useState(false);
	const account = useAccount();
	const modalRef = useRef<HTMLDivElement>(null);

	useClickOutside(modalRef, () => setIsReceiverModalVisible(false));

	const [isReceiverModalVisible, setIsReceiverModalVisible] = useState(false);

	const handleSign = async () => {
		const signatureHash = await signMessageAsync({
			message: document.fileName,
		});
		setSignatureHash(signatureHash);
	};

	const getBase64PDFData = () => {
		if (!signatureHash) return;
		const decodedData = decodeBase64(document.fileData);
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

	const sendDocument = async () => {
		if (!signatureHash || !receiver || !base64PDFData) return;
		setDocumentIsSending(true);
		try {
			const res = await sendDocumentToAddress({
				...document,
				fileData: base64PDFData || "", // use fileName as fileData for now, optimize size of data later
				fromAddr: account.address as string,
				toAddr: receiver,
			});
			console.log(res);
			setDocumentSent(true);
			alert("Document sent successfully!");
			setIsReceiverModalVisible(false);
		} catch (error) {
			console.error(error);
		} finally {
			setDocumentIsSending(false);
		}
	};

	return (
		<>
			<button
				type="button"
				className="btn-default py-2 px-4 rounded-lg"
				onClick={() => setIsReceiverModalVisible(true)}
				disabled={account.status !== "connected"}
			>
				{documentSent ? "Sent" : "Send"}
			</button>

			{isReceiverModalVisible && (
				<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-4 rounded-lg w-[600px]" ref={modalRef}>
						<h2 className="text-2xl font-bold text-left mb-4 text-primary-dark">
							Send document to
						</h2>
						<div className="flex flex-col gap-4">
							<div className="flex gap-4">
								<div className="text-left">
									If you want to send file data, please provide your approval
								</div>
								{signatureHash ? (
									<p className="flex items-center text-lg text-green-500 gap-4 ">
										File signed <IconCheck />
									</p>
								) : (
									<button
										type="button"
										className="btn-default py-2 px-4 rounded-lg w-[200px]"
										onClick={handleSign}
									>
										Sign
									</button>
								)}
							</div>

							<label htmlFor="receiver" className="block text-start">
								Receiver
							</label>
							<div className="flex items-center gap-2">
								<input
									type="text"
									id="receiver"
									name="receiver"
									className="border border-solid p-2 rounded-lg flex-1 bg-white"
									value={receiver}
									onChange={(e) => setReceiver(e.target.value)}
								/>
								<button
									type="button"
									className="btn-default py-2 px-4 rounded-lg"
									disabled={!receiver || !signatureHash}
									onClick={sendDocument}
								>
									{documentIsSending
										? "Sending..."
										: documentSent
											? "Sent"
											: "Send"}
								</button>
							</div>

							<button
								type="button"
								className="btn-default mt-4 py-2 px-4 rounded-lg self-start"
								onClick={() => setIsReceiverModalVisible(false)}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
});
