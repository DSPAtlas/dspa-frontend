import { useState, useRef,useCallback } from 'react';
import config from '../config.json'; // Ensure you have config properly imported

async function getPdbIds(uniprotAccession) {
    const url = `https://rest.uniprot.org/uniprotkb/${uniprotAccession}.json`;

    const alphafoldStructure = [
        { 
            id: `AF-${uniprotAccession}-F1`, 
            properties: [
                { key: 'Method', value: 'AlphaFold' }, 
                { key: 'Resolution', value: 'N/A' }, 
                { key: 'Chains', value: 'N/A' }
            ] 
        },
    ];
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to retrieve data for accession ${uniprotAccession}`);
        }
        
        const data = await response.json();
        const pdbIds = data.uniProtKBCrossReferences
            ?.filter(ref => ref.database === 'PDB')
            .map(ref => ({
                id: ref.id,
                properties: ref.properties || [],
            })) || [];

        return [...alphafoldStructure, ...pdbIds];
    } catch (error) {
        console.error(`Error fetching PDB IDs for ${uniprotAccession}:`, error);
        return alphafoldStructure;
    }
}

export const useProteinData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [proteinData, setProteinData] = useState(null);
    const [pdbIds, setPdbIds] = useState([]);

    const isMounted = useRef(true);

    const fetchProteinData = useCallback(async (proteinName) => {
        if (!proteinName) return;

        setLoading(true);
        setError('');

        const queryParams = `proteinName=${encodeURIComponent(proteinName)}`;
        const url = `${config.apiEndpoint}proteins?${queryParams}`;

        try {
            const [proteinResponse, pdbResponse] = await Promise.all([
                fetch(url),
                getPdbIds(proteinName)
            ]);

            if (!proteinResponse.ok) {
                throw new Error(`Failed to fetch protein data: ${proteinResponse.statusText}`);
            }

            const data = await proteinResponse.json();

            if (!isMounted.current) return;

            setProteinData(data.proteinData || {});
            setPdbIds(pdbResponse);
        } catch (error) {
            console.error(`Error fetching protein data: ${error.message}`);
            if (isMounted.current) {
                setError(error.message);
                setProteinData({});
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, []);

    // Cleanup to prevent memory leaks
    useState(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    return { loading, error, proteinData, pdbIds, fetchProteinData };
};