import type { DocumentData, GetDocumentResponse } from "../../interfaces";

const BASE_URL = 'http://localhost:3000';


export const sendDocument = async (document: DocumentData) => {
  return api.post('api/sendToAddress', document);
}


export const getDocuments = async (address: string, documentType: string): Promise<GetDocumentResponse[]> => {
  const params = new URLSearchParams();
  params.append('userAddr', address);
  if (documentType) {
    params.append('dataType', documentType);
  }

  return api.get(`api/documents?${params.toString()}`);
}

export const api = {
    async get(path: string) {
        const response = await fetch(`${BASE_URL}/${path}`);
        return response.json();
    },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async post(path: string, body: any) {
        const response = await fetch(`${BASE_URL}/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return response.json();
    },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async put(path: string, body: any) {
        const response = await fetch(`${BASE_URL}/${path}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return response.json();
    },
    async delete(path: string) {
        const response = await fetch(`${BASE_URL}/${path}`, {
            method: 'DELETE',
        });
        return response.json();
    },
};


