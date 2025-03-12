import { useState, useRef,useCallback, useEffect } from 'react';
import config from '../config.json'; // Ensure you have config properly imported

export async function getPdbIds(uniprotAccession) {
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
    const [error, setError] = useState('');
    const [proteinData, setProteinData] = useState(null);
    const [pdbIds, setPdbIds] = useState([]);
    const [selectedPdbId, setSelectedPdbId] = useState("");
    const isMounted = useRef(true);

    const fetchProteinData = useCallback(async (proteinName, signal) => {
        if (!proteinName) return;
        setError('');

        try {
            const queryParams = `proteinName=${encodeURIComponent(proteinName)}`;
            const url = `${config.apiEndpoint}proteins?${queryParams}`;
            const proteinResponse = await fetch(url, signal);

            if (!proteinResponse.ok) {
                throw new Error(`Failed to fetch protein data: ${proteinResponse.statusText}`);
            }
            const data = await proteinResponse.json();
            const pdbResponse = await getPdbIds(proteinName); // Assuming getPdbIds is async

            if (isMounted.current) {
                console.log("itsworking")
                setProteinData(data.proteinData || {});
                setPdbIds(pdbResponse);
                setSelectedPdbId(pdbIds[0].id);
            }
        } catch (error) {
            if (isMounted.current) {
                setError(`Error fetching protein data: ${error.message}`);
                setProteinData({});
                
            }
        } finally {
            if (isMounted.current) {
                console.log("proteindata loaded");
            }
        }
    }, []);

    useEffect(() => {
        return () => {
            isMounted.current = false;
           // abortController.abort();
        };
    }, []);

    return { error, proteinData, pdbIds, fetchProteinData, selectedPdbId, setSelectedPdbId };
};


