// AXIOS veza na API

import axiosInstance from './axiosInstance';

export async function login({ email, password }) {
  try {
    const response = await axiosInstance.post(`/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri prijavi');
  }
}

export async function register({ username, first_name, last_name, email, password }) {
  try {
    const response = await axiosInstance.post(`/auth/register`, {
      username,
      first_name,
      last_name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri registraciji');
  }
}

export async function getUserProfile() {
  try {
    const response = await axiosInstance.get(`/auth/profile`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju profila korisnika');
  }
}

export async function getUserPermissions() {
  try {
    const response = await axiosInstance.get(`/auth/user-permissions`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju dozvola korisnika');
  }
}

export async function postChangePassword({
  data: { current_password, new_password, new_password_confirmation },
}) {
  try {
    const response = await axiosInstance.post(`/auth/change-password`, {
      current_password,
      new_password,
      new_password_confirmation,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri promjeni lozinke');
  }
}

//SUPERADMIN AKTIVACIJA I DEAKTIVACIJA KORISNIKA
export async function postActivate({ id }) {
  try {
    const response = await axiosInstance.post(`/admin/users/activate/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri aktivaciji korisnika');
  }
}
export async function postDeactivate({ id }) {
  try {
    const response = await axiosInstance.post(`/admin/users/deactivate/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri deaktivaciji korisnika');
  }
}

// Verify email
export async function postVerifyEmail({ token }) {
  try {
    const response = await axiosInstance.post(`/auth/verify-email`, { token: token });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri verifikaciji korisnika');
  }
}

//DEACTIVATE ME

export async function postDeactivateMe({ data: { current_password } }) {
  try {
    const response = await axiosInstance.post(`/auth/deactivate`, {
      current_password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri deaktivaciji korisnika');
  }
}

//Aktivacija
export async function postActivateMe({ data: { email } }) {
  try {
    const response = await axiosInstance.post(`/auth/request-activation`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri verifikaciji korisnika');
  }
}

export async function postActivateMeFinal({ token }) {
  try {
    const response = await axiosInstance.post(`/auth/activate-account`, { token });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri verifikaciji korisnika');
  }
}
//FORGOT PASSWORD
export async function postForgotPassword({ data: { email } }) {
  try {
    const response = await axiosInstance.post(`/auth/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška');
  }
}

export async function postResendVerification({ data: { email } }) {
  try {
    const response = await axiosInstance.post(`/auth/resend-verification`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška');
  }
}

export async function postResetPassword({
  data: { email, password, password_confirmation },
  token,
}) {
  try {
    const response = await axiosInstance.post(`/auth/reset-password`, {
      email,
      token,
      password,
      password_confirmation,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška');
  }
}
