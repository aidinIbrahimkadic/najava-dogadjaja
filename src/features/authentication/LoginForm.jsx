import { useLogin } from './useLogin';

export default function Login() {
  const { login, isError, isPending, error } = useLogin();

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
