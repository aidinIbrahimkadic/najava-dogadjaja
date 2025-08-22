import axiosInstance from './axiosInstance';

export async function getManifestations(query = {}) {
  const { page = 1, limit = 10, search, sort, filters = {} } = query;

  const params = { page, limit };

  if (search) params.search = search;

  if (sort?.field && sort?.order) {
    params.sortBy = sort.field || 'start_date';
    params.sortOrder = sort.order || 'DESC'; // 'ASC' | 'DESC'
  }

  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === null || v === '') continue;
    params[k] = v;
  }

  try {
    const response = await axiosInstance.get(`/events/manifestacije`, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju manifestacija');
  }
}

export async function getUpcomingManifestations() {
  try {
    const response = await axiosInstance.get(`/events/manifestacije/upcoming`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Greška pri dobavljanju predstojecih manifestacija'
    );
  }
}

export async function postManifestation({
  title,
  description,
  start_time,
  end_time,
  location,
  speaker,
  slika,
  institucija_idguid,
}) {
  if (!title) throw new Error('Nedostaje neki od obaveznih podataka');

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('location', location || '');
    formData.append('start_time', start_time);
    formData.append('end_time', end_time || '');
    formData.append('speaker', speaker || '');
    formData.append('institucija_idguid', institucija_idguid);

    if (slika instanceof FileList) {
      formData.append('slika', slika[0]);
    }

    const response = await axiosInstance.post(`/events/manifestacije`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dodavanju manifestacije');
  }
}

export async function deleteManifestation(id) {
  if (!id) throw new Error('ID manifestacije je obavezan');

  try {
    await axiosInstance.delete(`/events/manifestacije/${id}`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri brisanju manifestacije');
  }
}

export async function updateManifestation({
  data: { title, description, start_time, end_time, location, speaker, slika, institucija_idguid },
  editId: id,
  // Image url
}) {
  if (!id) throw new Error('Manifestation ID is required');
  if (!title) throw new Error('Nedostaju neki od obaveznih podataka');

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('location', location || '');
    formData.append('start_time', start_time);
    formData.append('end_time', end_time || '');
    formData.append('speakre', speaker || '');
    formData.append(
      'institucija_idguid',
      institucija_idguid || '00000000-0000-0000-0000-000000000000'
    );

    if (slika instanceof FileList && slika.length > 0) {
      formData.append('slika', slika[0]);
    }

    const response = await axiosInstance.put(`/events/manifestacije/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju manifestacije');
  }
}

export async function updateManifestationDeleteImage({ id }) {
  try {
    const response = await axiosInstance.delete(`/events/manifestacije/remove-image/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju manifestacije');
  }
}
