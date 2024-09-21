export const useFetchDocuments = () => {
    const fetchDocuments = async () => {
        const response = await fetch('http://localhost:3000/documents');
        return response.json();
    };

    return { fetchDocuments };
}