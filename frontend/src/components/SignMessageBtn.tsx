import { useSignMessage } from "wagmi";

export const SignMessageBtn = () => {
	const { signMessage } = useSignMessage();

	return (
		<button
			type="button"
			onClick={() => signMessage({ message: "hello world" })}
		>
			Sign
		</button>
	);
};
