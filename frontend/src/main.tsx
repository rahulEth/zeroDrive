// import { Buffer } from 'buffer'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
import { config, initWeb3Modal } from "./wagmi.ts";

import "./index.css";
import { BrowserRouter } from "react-router-dom";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

initWeb3Modal();

const rootElement = document.getElementById("root");
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</QueryClientProvider>
			</WagmiProvider>
		</React.StrictMode>,
	);
} else {
	console.error("Root element not found");
}
