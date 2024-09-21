import { memo } from "react";
import { useAccount, useSignMessage } from "wagmi";

export const SignMessageBtn = memo(() => {
	const { signMessage, data, status } = useSignMessage();
	const account = useAccount();

	console.log(data);

	return (
		<button
			type="button"
			className="btn-default py-2 px-4 rounded-lg"
			onClick={() =>
				status === "idle" ? signMessage({ message: "hello world" }) : null
			}
			disabled={account.status !== "connected"}
		>
			{status === "success" ? "Sent" : "Send"}
		</button>
	);
});
