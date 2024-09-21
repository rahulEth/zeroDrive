// import { downloadPDF } from "../utils/helpers";

import { DownloadIcon } from "./Icons";

interface PDFDownloaderProps {
	base64PDFData: string;
	fileName: string;
}

export const PDFDownloader: React.FC<PDFDownloaderProps> = ({
	base64PDFData,
	fileName,
}) => {
	return (
		<div>
			<a
				download={fileName}
				href={base64PDFData}
				className="flex gap-4 border-b-2 py-4"
			>
				Download PDF <DownloadIcon />
			</a>
		</div>
	);
};
