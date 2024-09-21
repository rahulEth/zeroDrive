
export interface DocumentData { 
  fromAddr: string; //owner of the document
  fileName: string; //name of the document
  dataType: string; //type of the document
  fileData: string; //data of the document
  toAddr: string; //receiver of the document
}

export interface PostDocumentResponse {
  attestationId: string; //id of the document
  txHash: string; //hash of the document
  indexingValue: string; //value of the document
}

export interface GetDocumentResponse extends DocumentData {
  metadata: string; //metadata of the document
  timestamp: string; //timestamp of the document
}