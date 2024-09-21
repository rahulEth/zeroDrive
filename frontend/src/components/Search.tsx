export const Search = ({
	onSearch,
	searchString,
	setSearchString,
}: {
	onSearch: (search: string) => void;
	searchString: string;
	setSearchString: (search: string) => void;
}) => {
	const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchString(value);
		onSearch(value.toLowerCase());
	};
	return (
		<div className="w-full flex gap-4">
			<input
				type="text"
				placeholder="Search..."
				onChange={onSearchChange}
				value={searchString}
				className="flex-1 border border-solid p-2 w-full rounded-lg"
			/>
			<button
				className="btn-default py-2 px-4 rounded-lg w-[100px]"
				type="button"
				onClick={() => onSearch(searchString)}
			>
				Search
			</button>
		</div>
	);
};
