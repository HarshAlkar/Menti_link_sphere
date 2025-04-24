import { useState, useEffect } from 'react';

const APITest = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('/api/test/');
        const data = await response.json();
        setMessage(data.message);
        setLoading(false);
      } catch (err) {
        setError('Failed to connect to API');
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">API Test</h2>
      <p className="text-green-600">{message}</p>
    </div>
  );
};

export default APITest; 