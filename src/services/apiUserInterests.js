import axiosInstance from './axiosInstance';

export async function getUserInterests() {
  try {
    const response = await axiosInstance.get(`/events/user-interests`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju interesa korisnika');
  }
}

export async function getUserInterest(id) {
  try {
    const response = await axiosInstance.get(`/events/user-interests/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju interesa korisnika');
  }
}

export async function deleteUserInterests(id) {
  try {
    await axiosInstance.delete(`/events/user-interests/${id}`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri brisanju interesa korisnika');
  }
}

export async function postUserInterests({ category_idguids }) {
  try {
    const response = await axiosInstance.post(`/events/user-interests`, {
      category_idguids,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dodavanju interesa korisnika');
  }
}

export async function updateUserInterests({ category_idguids = [] }) {
  //OVDJE DOBIJEM []
  console.log('User interests u apiju:', category_idguids);

  try {
    const response = await axiosInstance.post(`/events/user-interests/update-all`, {
      category_idguids: [...category_idguids],
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju interesa');
  }
}
