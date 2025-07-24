import axiosInstance from './axiosInstance';

export async function getLocations() {
  try {
    const response = await axiosInstance.get(`/events/lokacije`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getLocation(id) {
  if (!id) throw new Error('Location ID is required');

  try {
    const response = await axiosInstance.get(`/events/lokacije/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteLocation(id) {
  if (!id) throw new Error('Location ID is required');

  try {
    await axiosInstance.delete(`/events/lokacije/${id}`);
    return id;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function postLocation({ naziv, opis, boja }) {
  if (!naziv) throw new Error('Naziv lokacije je obavezan');

  const response = await axiosInstance.post(`/events/location`, {
    naziv,
    opis,
    boja,
  });
  return response.data;
}

export async function updateCategory({ data: { naziv, opis, boja }, editId: id }) {
  if (!id) throw new Error('Category ID is required');
  if (!naziv) throw new Error('Naziv kategorije je obavezan');

  try {
    const response = await axiosInstance.put(`/events/kategorije/${id}`, {
      naziv,
      opis,
      boja,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// export async function checkIfCategoryIsUsed(categoryId) {
//   const res = await fetch(`/events?category=${categoryId}`);
//   const data = await res.json();
//   return data.length > 0;
// }
