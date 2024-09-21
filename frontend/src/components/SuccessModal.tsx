export const SuccessModal = ({
	close,
	linkProof,
}: {
	close: () => void;
	linkProof: string;
}) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white p-8 rounded-lg">
				<h2 className="text-2xl font-bold">Success</h2>
				<p className="text-lg">Your file has been successfully uploaded</p>

				<div className="mt-4 border-b-2 py-4">
					<h3 className="font-bold">InterPlanetary File System link:</h3>
					<a href={linkProof} target="_black">
						{linkProof}
					</a>
				</div>

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
