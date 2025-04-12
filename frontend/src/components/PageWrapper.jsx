import { useLayoutEffect } from 'react';
import { useLoading } from '../context/loadingContext'; 

const PageWrapper = ({ children }) => {
  const { setLoading } = useLoading();

  useLayoutEffect(() => {
    // Fires right after children are mounted
    setLoading(false);
  }, [setLoading]);

  return children;
};

export default PageWrapper;
