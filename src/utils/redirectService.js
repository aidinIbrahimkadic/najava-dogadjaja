let redirectFn = null;

export const setRedirectHandler = (fn) => {
  redirectFn = fn;
};

export const redirectToLogin = (message = null) => {
  if (redirectFn) {
    redirectFn(message);
  } else {
    console.warn('Redirect funkcija nije postavljena');
    // Fallback ako neko koristi axios izvan React okruženja
    window.location.href = '/login';
  }
};
