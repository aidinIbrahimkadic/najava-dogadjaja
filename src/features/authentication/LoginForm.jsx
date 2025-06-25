import CalendarSpinner from '../../ui/CalendarSpinner';
import { useLogin } from './useLogin';

export default function Login() {
  const { login, isPending } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    login({ email, password });
  }

  return (
    <>
      {isPending ? (
        <CalendarSpinner />
      ) : (
        <>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Unesi email: </label>
            <input type="text" id="email" required />
            <label htmlFor="password">Unesi password:</label>
            <input type="password" id="password" required />
            <button type="submit" disabled={isPending}>
              Login
            </button>
          </form>
        </>
      )}
    </>
  );
}
