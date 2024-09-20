import { useAccount } from "wagmi";
import { truncateEthAddress } from "../utils/truncateAddress";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

const Header = () => {
	const [isDarkMode, setDarkMode] = useState(true);
	const { open: openWeb3Modal } = useWeb3Modal();
	const account = useAccount();
	const isConnected = account.status === "connected";

	const toggleDarkMode = () => {
		setDarkMode(!isDarkMode);
		if (isDarkMode) {
			document.documentElement.classList.remove("dark");
		} else {
			document.documentElement.classList.add("dark");
		}
	};

	return (
		<header className="w-ful border-b border-gray-600 p-4 flex justify-between items-center">
			<div className="flex items-center">
				<div className="flex items-center justify-center text-center text-accent font-bold">
					<span>Zero</span>
					<span>Drive</span>
				</div>
			</div>

			<div className="flex align-middle gap-4">
				<button
					type="button"
					className="text-accent"
					onClick={() => toggleDarkMode()}
				>
					{isDarkMode ? <MoonIcon /> : <SunIcon />}
				</button>
				<button
					onClick={() => openWeb3Modal()}
					type="button"
					className="btn-default py-2 px-4 rounded-lg w-[150px]"
				>
					{isConnected ? truncateEthAddress(account.address) : "Connect"}
				</button>
			</div>
		</header>
	);
};

export default Header;
