import axiosInstance from './axiosInstance';

export async function getLocations(query = {}) {
  const { page = 1, limit = 10, search, sort, filters = {} } = query;

  const params = { page, limit };

  if (search) params.search = search;
  if (sort?.field && sort?.order) {
    params.sortBy = sort.field;
    params.sortOrder = sort.order; // 'ASC' | 'DESC'
  }

  // očekivani ključevi filtera: npr. naziv, adresa, mjesto (ili kako već)
  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === null || v === '') continue;
    params[k] = v;
  }

  const res = await axiosInstance.get('/events/lokacije', { params });
  return res.data; // očekuje: { total, page, limit, data: [...] }
}

export async function getLocation(id) {
  if (!id) throw new Error('Location ID is required');

  try {
    const response = await axiosInstance.get(`/events/lokacije/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju lokacije');
  }
}

export async function deleteLocation(id) {
  if (!id) throw new Error('Location ID is required');

  try {
    await axiosInstance.delete(`/events/lokacije/${id}`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri brisanju lokacije');
  }
}

export async function postLocation({
  naziv,
  opis,
  adresa,
  mjesto,
  longitude,
  latitude,
  user_idguid,
}) {
  if (!naziv) throw new Error('Naziv lokacije je obavezan');

  try {
    const response = await axiosInstance.post(`/events/lokacije`, {
      naziv,
      opis,
      adresa,
      mjesto,
      longitude,
      latitude,
      user_idguid,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dodavanju lokacije');
  }
}

export async function updateLocation({
  data: { naziv, opis, adresa, mjesto, longitude, latitude },
  editId: id,
}) {
  if (!id) throw new Error('Location ID is required');
  if (!naziv) throw new Error('Naziv lokacije je obavezan');

  try {
    const response = await axiosInstance.put(`/events/lokacije/${id}`, {
      naziv,
      opis,
      adresa,
      mjesto,
      longitude,
      latitude,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju lokacije');
  }
}
