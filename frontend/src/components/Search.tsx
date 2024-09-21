import { useState } from "react";

export const Search = ({
	onSearch,
}: {
	onSearch: (search: string) => void;
}) => {
	const [search, setSearch] = useState("");
	const handleSearch = () => {
		console.log(search);
	};
	const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(e.target.value);
		onSearch(value);
	};
	return (
		<div className="w-full flex gap-4">
			<input
				type="text"
				placeholder="Search..."
				onChange={onSearchChange}
				value={search}
				className="flex-1 border border-solid p-2 w-full rounded-lg"
			/>
			<button className="btn-default py-2 px-4 rounded-lg w-[100px]" type="button" onClick={handleSearch}>
				Search
			</button>
		</div>
	);
};
