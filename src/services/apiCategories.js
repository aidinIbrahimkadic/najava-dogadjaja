import axiosInstance from './axiosInstance';

export async function getCategories() {
  try {
    const response = await axiosInstance.get(`/events/kategorije`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju kategorija');
  }
}

export async function getCategory(id) {
  if (!id) throw new Error('Category ID is required');

  try {
    const response = await axiosInstance.get(`/events/kategorije/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju kategorije');
  }
}

export async function deleteCategory(id) {
  if (!id) throw new Error('Category ID is required');

  try {
    await axiosInstance.delete(`/events/kategorije/${id}`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri brisanju kategorije');
  }
}

export async function postCategory({ naziv, opis, boja, ikona }) {
  if (!naziv) throw new Error('Naziv kategorije je obavezan');

  const response = await axiosInstance.post(`/events/kategorije`, {
    naziv,
    opis,
    boja,
    ikona,
  });
  return response.data;
}

export async function updateCategory({ data: { naziv, opis, boja, ikona }, editId: id }) {
  if (!id) throw new Error('Category ID is required');
  if (!naziv) throw new Error('Naziv kategorije je obavezan');

  try {
    const response = await axiosInstance.put(`/events/kategorije/${id}`, {
      naziv,
      opis,
      boja,
      ikona,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju kategorije');
  }
}

// export async function checkIfCategoryIsUsed(categoryId) {
//   const res = await fetch(`/events?category=${categoryId}`);
//   const data = await res.json();
//   return data.length > 0;
// }
