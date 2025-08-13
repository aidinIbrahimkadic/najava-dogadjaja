import axiosInstance from './axiosInstance';

export async function getUpcomingEvents() {
  try {
    const response = await axiosInstance.get(`/events/upcoming`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju događaja');
  }
}

export async function getAllEvents() {
  try {
    const response = await axiosInstance.get(`/events?sortOrder=DESC&sortBy=id`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju događaja');
  }
}

export async function getEventById(id) {
  if (!id) throw new Error('Category ID is required');

  try {
    const response = await axiosInstance.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju eventa');
  }
}

export async function getAllCategories() {
  try {
    const response = await axiosInstance.get(`/kategorije`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju kategorija');
  }
}

// export async function deleteCategory(id) {
//   if (!id) throw new Error('Category ID is required');

//   try {
//     await axiosInstance.delete(`/events/kategorije/${id}`);
//     return id;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Greška pri brisanju kategorije');
//   }
// }

// export async function postCategory({ naziv, opis, boja, ikona, parent_idguid }) {
//   if (!naziv) throw new Error('Naziv kategorije je obavezan');

//   const response = await axiosInstance.post(`/events/kategorije`, {
//     naziv,
//     opis,
//     boja,
//     ikona,
//     parent_idguid,
//   });
//   return response.data;
// }

// export async function updateCategory({
//   data: { naziv, opis, boja, ikona, parent_idguid },
//   editId: id,
// }) {
//   if (!id) throw new Error('Category ID is required');
//   if (!naziv) throw new Error('Naziv kategorije je obavezan');

//   try {
//     const response = await axiosInstance.put(`/events/kategorije/${id}`, {
//       naziv,
//       opis,
//       boja,
//       ikona,
//       parent_idguid,
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Greška pri ažuriranju kategorije');
//   }
// }
