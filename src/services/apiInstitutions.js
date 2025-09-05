import axiosInstance from './axiosInstance';

export async function getInstitutions(query = {}) {
  let { page = 1, limit = 10, search, sort, filters = {}, all = false } = query;

  const params = {};
  if (all || limit === 'ALL') {
    params.page = 1;
    params.limit = 10000; // dovoljno veliko da pokrije sve
  } else {
    params.page = page;
    params.limit = limit;
  }

  if (search?.trim()) params.search = search.trim();

  if (sort?.field && sort?.order) {
    params.sortBy = sort.field;
    params.sortOrder = sort.order;
    params.sort = `${sort.field}:${sort.order}`;
  }

  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== '') params[k] = v;
  }

  const res = await axiosInstance.get('/events/institucije', { params });
  return res.data; // { data, total, page, limit, ... }
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
