import { useState } from 'react';
import { getApiUrl } from '../helpers/getApiUrl';

export function useCreateProject() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = getApiUrl();
  function create(data) {
    setIsLoading(true);
    console.log('data', data);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
    return fetch(`${apiUrl}/api/Project`, requestOptions)
      .then((response) => {
        const data = response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return error;
        }
        setStatus(0);
        setIsLoading(false);
      })
      .catch((error) => {
        setStatus(error);
        console.error('There was an error!', error);
      });
  }

  return {
    create,
    isLoading,
    status,
  };
}
