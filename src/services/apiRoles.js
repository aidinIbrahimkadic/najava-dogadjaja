import axiosInstance from './axiosInstance';

export async function getRoles() {
  try {
    const response = await axiosInstance.get(`/admin/roles`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju role');
  }
}

export async function getRole(id) {
  if (!id) throw new Error('Role ID is required');

  try {
    const response = await axiosInstance.get(`/admin/roles/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju role');
  }
}

export async function deleteRole(id) {
  if (!id) throw new Error('Role ID is required');

  try {
    await axiosInstance.delete(`/admin/roles/${id}`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri brisanju role');
  }
}

export async function postRole({ name, description }) {
  if (!name) throw new Error('Ime role je obavezno!');

  try {
    const response = await axiosInstance.post(`/admin/roles`, {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dodavanju role');
  }
}

export async function updateRole({ data: { name, description }, editId: id }) {
  if (!id) throw new Error('Role ID is required');

  try {
    const response = await axiosInstance.put(`/admin/roles/${id}`, {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju role');
  }
}
