import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Ako koristiš react-router-dom v6+
import { usePostVerifyEmail } from './usePostVerifyEmail';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  const { postVerifyEmail } = usePostVerifyEmail();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token nije pronađen u linku.');
      return;
    }

    postVerifyEmail({ token });
  }, [searchParams, postVerifyEmail]);

  if (status === 'loading') return <div>Verifikacija u toku...</div>;
  if (status === 'error') return <div style={{ color: 'red' }}>{message}</div>;
  return <div style={{ color: 'green' }}>{message}</div>;
}

export default VerifyEmail;
