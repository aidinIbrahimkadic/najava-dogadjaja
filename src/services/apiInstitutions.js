import axiosInstance from './axiosInstance';

// export async function getInstitutions() {
//   try {
//     const response = await axiosInstance.get(`/events/institucije`);
//     return response.data;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// }

export async function getInstitutions(query = {}) {
  const { page = 1, limit = 10, search, sort, filters = {} } = query;

  const params = { page, limit };

  if (search) params.search = search;

  if (sort?.field && sort?.order) {
    params.sortBy = sort.field; // npr. 'naziv'
    params.sortOrder = sort.order; // 'ASC' | 'DESC'
    params.sort = `${sort.field}:${sort.order}`; // ako backend voli i kombinovani ključ
  }

  // Ravni filteri: npr. ?naziv=...&opis=...
  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === null || v === '') continue;
    params[k] = v;
  }

  const res = await axiosInstance.get('/events/institucije', { params });
  return res.data; // očekuje: { data, total, page, limit, ... }
}

export async function getInstitution(id) {
  if (!id) throw new Error('Institution ID is required');

  try {
    const response = await axiosInstance.get(`/events/institucije/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteInstitution(id) {
  if (!id) throw new Error('Institution ID is required');

  try {
    await axiosInstance.delete(`/events/institucije/${id}`);
    return id;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function postInstitution({
  naziv,
  opis,
  ime_direktora,
  email,
  broj_telefona,
  adresa,
  web_stranica,
  boja_pozadine_postera,
  logo,
}) {
  if (!naziv) throw new Error('Naziv institucije je obavezan');

  const response = await axiosInstance.post(`/events/institucije`, {
    naziv,
    opis,
    ime_direktora,
    email,
    broj_telefona,
    adresa,
    boja_pozadine_postera,
    web_stranica,
    logo,
  });
  return response.data;
}

export async function updateInstitution({
  data: {
    naziv,
    opis,
    ime_direktora,
    email,
    broj_telefona,
    adresa,
    web_stranica,
    boja_pozadine_postera,
    logo,
  },
  editId: id,
}) {
  if (!id) throw new Error('Institution ID is required');
  if (!naziv) throw new Error('Naziv institucije je obavezan');

  try {
    const response = await axiosInstance.put(`/events/institucije/${id}`, {
      naziv,
      opis,
      ime_direktora,
      email,
      broj_telefona,
      adresa,
      web_stranica,
      boja_pozadine_postera,
      logo,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
