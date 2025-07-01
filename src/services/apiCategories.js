import axiosInstance from './axiosInstance';

export async function getCategories() {
  try {
    const response = await axiosInstance.get(`/events/kategorije`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getCategory(id) {
  if (!id) throw new Error('Category ID is required');

  try {
    const response = await axiosInstance.get(`/events/kategorije/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteCategory(id) {
  if (!id) throw new Error('Category ID is required');

  try {
    await axiosInstance.delete(`/events/kategorije/${id}`);
    return id;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function postCategory({ naziv, opis }) {
  if (!naziv) throw new Error('Naziv kategorije je obavezan');

  try {
    const response = await axiosInstance.post(`/events/kategorije`, {
      naziv,
      opis,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateCategory({ data: { naziv, opis }, editId: id }) {
  if (!id) throw new Error('Category ID is required');
  if (!naziv) throw new Error('Naziv kategorije je obavezan');

  try {
    const response = await axiosInstance.put(`/events/kategorije/${id}`, {
      naziv,
      opis,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
