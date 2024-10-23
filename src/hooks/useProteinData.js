import { useState, useCallback } from 'react';
import config from '../config.json'; // Ensure you have config properly imported

async function getPdbIds(uniprotAccession) {
    const url = `https://rest.uniprot.org/uniprotkb/${uniprotAccession}.json`;

    const alphafoldstructure = [
        { id: `AF-${uniprotAccession}-F1`, properties: [
            { key: 'Method', value: 'AlphaFold' }, 
            { key: 'Resolution', value: ' ' }, 
            { key: 'Chains', value: ' ' }] },
       ];
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to retrieve data for accession ${uniprotAccession}`);
        }
        
        const data = await response.json();
        const pdbIds = data.uniProtKBCrossReferences
            .filter(ref => ref.database === 'PDB')
            .map(ref=> ({
                id: ref.id,
                properties: ref.properties
            }));
        
        return [...alphafoldstructure, ...pdbIds];
    } catch (error) {
        console.error(error);
        return alphafoldstructure;
    }
}

// Custom hook for fetching protein data
export const useProteinData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [proteinData, setProteinData] = useState(null);
    const [pdbIds, setPdbIds] = useState([]);

    const fetchProteinData = useCallback(async (proteinName) => {
        setLoading(true);
        setError('');
        const taxonomyID = 559292;  // Hardcoded for now, you can parameterize this if needed

        const queryParams = `taxonomyID=${encodeURIComponent(taxonomyID)}&proteinName=${encodeURIComponent(proteinName)}`;
        const url = `${config.apiEndpoint}proteins?${queryParams}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); 
            setProteinData(data.proteinData);

            const pdbIds = await getPdbIds(proteinName);  
            setPdbIds(pdbIds);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setError('Failed to load protein data');
            setProteinData({});
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, proteinData, pdbIds, fetchProteinData };
};
