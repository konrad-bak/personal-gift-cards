import { useEffect, useState } from 'react';
import useFetchAxios from '../utils/customHooks/useFetchAxios';

const Login = () => {
  const [serverText, setServerText] = useState(null);

  const { data, loading, error } = useFetchAxios<any>('http://127.0.0.1:8080');

  useEffect(() => {
    if (data?.serverText) {
      setServerText(data.serverText);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>{serverText}</h1>
    </>
  );
};

export default Login;
