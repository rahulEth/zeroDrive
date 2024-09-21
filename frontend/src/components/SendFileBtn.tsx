import { memo, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { sendDocumentToAddress } from "../modules/api";
import useClickOutside from "../hooks/useClickOutside";

type Doc = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	[x: string]: any;
	fileName: string;
	fileData: string;
	dataType: string;
};

export const SendFileBtn = memo(({ document }: { document: Doc }) => {
	const [receiver, setReceiver] = useState("");
	const [documentSent, setDocumentSent] = useState(false);
	const account = useAccount();
	const modalRef = useRef<HTMLDivElement>(null);

	const [isReceiverModalVisible, setIsReceiverModalVisible] = useState(false);

	const sendDocument = async () => {
		try {
			const res = await sendDocumentToAddress({
				...document,
				fileData: document.fileName, // use fileName as fileData for now, optimize size of data later
				fromAddr: account.address as string,
				toAddr: receiver,
			});
			console.log(res);
			setDocumentSent(true);
		} catch (error) {
			console.error(error);
		}
	};

	useClickOutside(modalRef, () => setIsReceiverModalVisible(false));

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
					<div className="bg-white p-4 rounded-lg w-[500px]" ref={modalRef}>
						<h2 className="text-2xl font-bold text-left mb-4 text-primary-dark">
							Send document to
						</h2>
						<div className="flex flex-col gap-4">
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
									disabled={!receiver}
									onClick={sendDocument}
								>
									Send
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
