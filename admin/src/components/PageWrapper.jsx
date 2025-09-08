// components/PageReady.jsx
import { useEffect } from 'react';
import { useLoading } from '../context/loadingContext';

const PageWrapper = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
  
    setLoading(false);
  }, []);

  return null;
};

export default PageWrapper;
