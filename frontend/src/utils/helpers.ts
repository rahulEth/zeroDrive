// Helper function to convert base64 to a Blob in TypeScript
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64); // Decode base64
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}


// Function to trigger download or open the PDF in TypeScript
export function downloadPDF(base64Data: string): void {
  // Assuming the data is a base64 string of the PDF content
  const blob = base64ToBlob(base64Data, "application/pdf");
  const blobUrl = URL.createObjectURL(blob);

  // Create a link to download the file
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "file.pdf"; // Set the name of the downloaded file
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Optionally, you can open the PDF in a new tab
  // window.open(blobUrl, '_blank');
}
