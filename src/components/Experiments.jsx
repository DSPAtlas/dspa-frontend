const ExperimentInfo = () => {
    const { experimentID } = useParams(); 
    
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const fetchExperimentInfo = async () => {
        setLoading(true);
        setError('');
        const queryParams = `lipExperimentID=${encodeURIComponent(experimentID)}`;
        const url = `${config.apiEndpoint}/v1/experiments?${queryParams}`;
        console.log(url);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json(); 
            setExperimentData(data.experimentData);
            
        } catch (error) {
            console.error("Error fetching data: ", error);
            setError('Failed to load experiment data');
            setExperimentData({});
        } finally {
            setLoading(false);
        } 
    };

    useEffect(() => {
        fetchExperimentData();
    }, [experimentIDID]);
  
    const handleTaxonomyChange = (event) => {
        setSelectedTaxonomy(event.target.value);
    };

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        
        try {
            const queryParams = `searchTerm=${encodeURIComponent(searchTerm)}`;
            const url = `${config.apiEndpoint2}search?${queryParams}`;
            const response = await fetch(url);
            const data = await response.json();
        
        if (data.success) {
            setSearchResults(data);
            navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
            
        } else {
            throw new Error(data.message || 'Failed to fetch data');
        }
        } catch (err) {
        setError(err.message);
        }
    };


    return (
    <div className="results-experiment-search-container">
        {experimentData && <GOEnrichmentVisualization experimentData={experimentData} />}
    </div>
</>
);
};


export default ExperimentInfo;