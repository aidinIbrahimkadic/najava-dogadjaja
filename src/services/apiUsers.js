import axiosInstance from './axiosInstance';

export async function getUsers() {
  try {
    const response = await axiosInstance.get(`/admin/users`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju korisnika');
  }
}

export async function getUser(id) {
  if (!id) throw new Error('User ID is required');

  try {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju korisnika');
  }
}

export async function deleteUser(id) {
  if (!id) throw new Error('User ID is required');

  try {
    await axiosInstance.delete(`/admin/users/${id}`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri brisanju korisnika');
  }
}

export async function postUser({ email, first_name, last_name, password, password2, roles }) {
  if (!email) throw new Error('Email korisnika je obavezan');

  try {
    const response = await axiosInstance.post(`/admin/users`, {
      email,
      first_name,
      last_name,
      password,
      password2,
      roles,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dodavanju korisnika');
  }
}

export async function updateUser({
  data: { email, first_name, last_name, password, password2, roles },
  editId: id,
}) {
  if (!id) throw new Error('User ID is required');
  if (!email) throw new Error('Email korisnika je obavezan');

  try {
    const response = await axiosInstance.put(`/admin/users/${id}`, {
      email,
      first_name,
      last_name,
      password,
      password2,
      roles,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju korisnika');
  }
}
