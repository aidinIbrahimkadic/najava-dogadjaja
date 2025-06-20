import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../services/apiAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: login,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user.user);
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      console.log('ERROR', err);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    login({ email, password });
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Unesi email: </label>
        <input type="text" id="email" required />
        <label htmlFor="password">Unesi password:</label>
        <input type="password" id="password" required />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Loging in....' : 'Login'}
        </button>
        {isError && <p>Error: {error.message}</p>}
      </form>
    </>
  );
}
