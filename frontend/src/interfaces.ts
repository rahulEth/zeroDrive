
export type DocumentType = "personal" | "education" | "health" | "government" | "identity";

// HEDERA
export interface DocumentData {
  address: string;
  fileName: string;
  encryptedData: string;
  datatype: DocumentType;
  chainType: string;
}

export interface DocumentResponse {
  address: string;
  fileName: string;
  chainType: string;
  ipfsHash: { path: string }[];
  dataType: DocumentType;
  date: string;
}


// SIGN PROTOCOL

export interface DocumentSentData { 
  fromAddr: string; //owner of the document
  fileName: string; //name of the document
  dataType: string; //type of the document
  fileData: string; //data of the document
  toAddr: string; //receiver of the document
}

export interface PostDocumentToResponse {
  attestationId: string; //id of the document
  txHash: string; //hash of the document
  indexingValue: string; //value of the document
}

export interface GetDocumentResponse extends DocumentSentData {
  metadata: string; //metadata of the document
  timestamp: string; //timestamp of the document
}

