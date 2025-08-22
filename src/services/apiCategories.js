import axiosInstance from './axiosInstance';

export async function getCategories(query = {}) {
  const { page = 1, limit = 50, search, sort, filters = {} } = query;

  const params = { page, limit };

  if (search) params.search = search;

  if (sort?.field && sort?.order) {
    params.sortBy = sort.field;
    params.sortOrder = sort.order; // 'ASC' | 'DESC'
    // Ako backend prima i kombinovani ključ:
    // params.sort = `${sort.field}:${sort.order}`;
  }

  // Specijalno mapiranje za parent/child filter
  const ZERO = '00000000-0000-0000-0000-000000000000';

  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === null || v === '') continue;

    if (k === 'parent_idguid') {
      if (v === 'NOT_ZERO') {
        // Samo podkategorije: parent_idguid != ZERO
        // (ako backend nema _ne, javi pa ću premapirati na drugi parametar)
        params.parent_idguid = ZERO;
      } else if (v === ZERO) {
        // Samo grupe: parent_idguid == ZERO
        params.parent_idguid = ZERO;
      }
      continue;
    }

    params[k] = v;
  }

  try {
    const res = await axiosInstance.get('/events/kategorije', { params });
    return res.data; // očekuje: { data: [...], total, page, limit, ... }
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Greška pri dobavljanju kategorija');
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

export async function postCategory({ naziv, opis, boja, ikona, parent_idguid }) {
  if (!naziv) throw new Error('Naziv kategorije je obavezan');

  const response = await axiosInstance.post(`/events/kategorije`, {
    naziv,
    opis,
    boja,
    ikona,
    parent_idguid,
  });
  return response.data;
}

export async function updateCategory({
  data: { naziv, opis, boja, ikona, parent_idguid },
  editId: id,
}) {
  if (!id) throw new Error('Category ID is required');
  if (!naziv) throw new Error('Naziv kategorije je obavezan');

  try {
    const response = await axiosInstance.put(`/events/kategorije/${id}`, {
      naziv,
      opis,
      boja,
      ikona,
      parent_idguid,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju kategorije');
  }
}
