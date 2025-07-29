import axiosInstance from './axiosInstance';

export async function getPermissions() {
  try {
    const response = await axiosInstance.get(`/admin/permissions`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju dozvole');
  }
}

export async function getPermission(id) {
  if (!id) throw new Error('Permission ID is required');

  try {
    const response = await axiosInstance.get(`/admin/permissions/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju dozvole');
  }
}

export async function deletePermission(id) {
  if (!id) throw new Error('Permission ID is required');

  try {
    await axiosInstance.delete(`/admin/permissions/${id}`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri brisanju dozvole');
  }
}

export async function postPermission({ name, description }) {
  if (!name) throw new Error('Ime dozvole je obavezno!');

  try {
    const response = await axiosInstance.post(`/admin/permissions`, {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dodavanju dozvole');
  }
}

export async function updatePermission({ data: { name, description }, editId: id }) {
  if (!id) throw new Error('ID is required');

  try {
    const response = await axiosInstance.put(`/admin/permissions/${id}`, {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju dozvole');
  }
}
