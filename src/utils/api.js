const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

// Function to make a generic HTTP GET request
export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Example function to get table names from your server
export const getTableNames = async () => {
  try {
    const data = await fetchData('api/tables'); // Replace with your actual API endpoint
    return data.tables; // Assuming the API response has a 'tables' property
  } catch (error) {
    // Handle or log the error
    throw error;
  }
};
