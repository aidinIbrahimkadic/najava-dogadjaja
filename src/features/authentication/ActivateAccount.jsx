// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom'; // Ako koristiš react-router-dom v6+
// import { useActivateMeFinal } from './useActivateMeFinal';

// function ActivateAccount() {
//   const [searchParams] = useSearchParams();
//   const [status, setStatus] = useState('loading'); // loading, success, error
//   const [message, setMessage] = useState('');

//   const { activateFinal } = useActivateMeFinal();

//   useEffect(() => {
//     const token = searchParams.get('token');
//     if (!token) {
//       setStatus('error');
//       setMessage('Token nije pronađen u linku.');
//       return;
//     }

//     activateFinal({ token });
//   }, [searchParams, activateFinal]);

//   if (status === 'loading') return <div>Aktivacija u toku...</div>;
//   if (status === 'error') return <div style={{ color: 'red' }}>{message}</div>;
//   return <div style={{ color: 'green' }}>{message}</div>;
// }

// export default ActivateAccount;

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useActivateMeFinal } from './useActivateMeFinal';

function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  // Pretpostavka: hook vraća funkciju koja vraća Promise (npr. React Query mutateAsync ili custom fetch)
  const { activateFinal } = useActivateMeFinal();

  useEffect(() => {
    let isMounted = true;

    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token nije pronađen u linku.');
      return;
    }

    (async () => {
      try {
        const res = await activateFinal({ token }); // npr. { ok: true, message: 'Račun aktiviran' }
        if (!isMounted) return;

        setStatus('success');
        setMessage(res?.message || 'Račun je uspješno aktiviran.');

        // Odmah (ili nakon kratkog timeouta) preusmjeri na login
        navigate('/login', {
          replace: true,
          state: { flash: 'Vaš račun je aktiviran. Prijavite se.' },
        });
      } catch (err) {
        if (!isMounted) return;
        setStatus('error');
        setMessage(
          err?.message || 'Aktivacija nije uspjela. Link je možda istekao ili je već iskorišten.'
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [searchParams, activateFinal, navigate]);

  if (status === 'loading') return <div>Aktivacija u toku...</div>;
  if (status === 'error') return <div style={{ color: 'red' }}>{message}</div>;
  return <div style={{ color: 'green' }}>{message}</div>;
}

export default ActivateAccount;
