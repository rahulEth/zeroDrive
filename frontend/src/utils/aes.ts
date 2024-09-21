import CryptoJS from 'crypto-js';

export function encryptData(data: string, secretKey: string) {
  const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encryptedData;
}

// Function to encode data in Base64
export function encodeBase64(data: string) {
  const encodedData = btoa(data);
  return encodedData;
}

// Function to decode Base64-encoded data
export function decodeBase64(encodedData: string) {
  const decodedData = atob(encodedData);
  return decodedData;
}
// Function to decrypt data using AES decryption
export function decryptData(encryptedData: string, secretKey:string) {
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
  return decryptedData;
}
