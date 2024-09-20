import { SignMessageBtn } from "./SignMessageBtn";

export interface Document {
	name: string;
	type: string;
	proof: string;
	date: string;
}

export const Table = ({
	data,
	isMine,
}: { data: Document[]; isMine?: boolean }) => {
	return (
		<table className="table-auto border border-gray-300 border-collapse rounded-lg">
			<thead>
				<tr>
					<th className="px-4 py-2  border border-gray-300 rounded-lg">Name</th>
					<th className="px-4 py-2  border border-gray-300 rounded-lg">Type</th>
					{!isMine && (
						<th className="px-4 py-2 border border-gray-300 rounded-lg">
							From
						</th>
					)}
					{isMine && (
						<th className="px-4 py-2  border border-gray-300 rounded-lg">
							Proof
						</th>
					)}
					<th className="px-4 py-2  border border-gray-300 rounded-lg">Date</th>
					{isMine && (
						<th className="px-4 py-2  border border-gray-300 rounded-lg">
							Verify
						</th>
					)}
				</tr>
			</thead>
			<tbody>
				{data.length ? (
					data.map((item, index) => (
						<tr key={item.date}>
							<td className="border px-4 py-2 border-gray-300 rounded-lg">
								{item.name}
							</td>
							<td className="border px-4 py-2 border-gray-300 rounded-lg">
								{item.type}
							</td>
							{isMine && (
								<td className="border px-4 py-2 border-gray-300 rounded-lg">
									{item.proof}
								</td>
							)}
							<td className="border px-4 py-2 border-gray-300 rounded-lg">
								{item.date}
							</td>
							{isMine && (
								<td className="border px-4 py-2 border-gray-300 rounded-lg">
									<SignMessageBtn />
								</td>
							)}
						</tr>
					))
				) : (
					<tr>
						<td className="border px-4 py-2 border-gray-300" colSpan={5}>
							No documents found
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};
