import { useMemo } from 'react';
export const ProteinScoresTable = ({ experimentData, onProteinClick, displayedProtein, goTerms, onGoTermSelect }) => {
    const sortedExperimentData = useMemo(() => {
        return [...experimentData].sort((a, b) => b.averageScore - a.averageScore);
    }, [experimentData]);

    if (!sortedExperimentData || !Array.isArray(sortedExperimentData)) {
        console.error("experimentData is not an array or is undefined:", experimentData);
        return <div>No valid data to display</div>;
    }

    return (
        <div className="condition-table-container">
            <div className="go-term-selector">
                <label htmlFor="goTermSelect">Filter by GO Term: </label>
                <select 
                    id="goTermSelect" 
                    onChange={(e) => onGoTermSelect(e.target.value)}
                    defaultValue=""
                    className="go-term-dropdown"
                >
                    <option value="">All</option>
                    {goTerms && goTerms.map((term, index) => (
                        <option key={index} value={term.go_term}>{term.go_term}</option>
                    ))}
                </select>
            </div>
            <table className="condition-protein-table">
                <thead>
                    <tr>
                        <th className= "condition-protein-table">Protein Accession</th>
                        <th className= "condition-protein-table">Average LiP Score among Experiments</th>
                        <th className= "condition-protein-table">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedExperimentData.map((proteinData) => (
                        <tr 
                        key={proteinData.proteinAccession}
                        className={`protein-row ${displayedProtein === proteinData.proteinAccession ? 'selected' : ''}`}
                        onClick={() => onProteinClick(proteinData.proteinAccession)}
                        >
                            <td>{proteinData.proteinAccession}</td>
                            <td>{Math.round(proteinData.averageScore || 0)}</td>
                            <td>{proteinData.protein_description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

