const UploadComponent = ({
	documentData,
	saveDocumentData,
	onSign,
}: {
	documentData: { base64: string; fileName: string } | null;
	saveDocumentData: (base64: string, fileName: string) => void;
	onSign: (fileName: string) => void;
}) => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleFileChange = (e: any) => {
		const file = e.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onloadend = () => {
				saveDocumentData(reader.result as string, file.name);
			};

			reader.onerror = (error) => {
				console.error("Error reading file: ", error);
			};
		}
	};

	return (
		<div className="p-y-4 w-full">
			<h2 className="text-l font-semibold mb-4">1. Upload a File</h2>

			{/* Display file name */}
			{documentData?.fileName ? (
				<div className="flex gap-5 items-center">
					<p className="text-gray-600">
						Uploaded File: {documentData.fileName}
					</p>
					<button
						type="button"
						className="btn-default py-2 px-4 rounded-lg w-[200px]"
						onClick={() => onSign(documentData.fileName)}
					>
						Sign file
					</button>
				</div>
			) : (
				<input
					type="file"
					onChange={handleFileChange}
					className="border border-dashed p-2 w-full h-[100px]"
				/>
			)}

			{/* Display Base64 output */}
			{/* {fileBase64 && (
				<div className="mt-4">
					<h3 className="font-bold">Base64 String:</h3>
					<textarea
						value={fileBase64}
						readOnly
						rows={10}
						className="w-full p-2 border rounded-md"
					/>
				</div>
			)} */}
		</div>
	);
};

export default UploadComponent;
