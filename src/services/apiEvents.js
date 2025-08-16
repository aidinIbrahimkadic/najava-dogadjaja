import axiosInstance from './axiosInstance';

export async function getEvents() {
  try {
    const response = await axiosInstance.get(`/events/events`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju događaja');
  }
}

export async function postEvent({
  title,
  description,
  location_idguid,
  start_date,
  end_date,
  is_public,
  slika,
  category_idguid,
  institucija_idguid,
  user_idguid,
  cijena,
  ima_vise_termina = false, // Optional, if you want to handle multiple dates
  termini = [], // Optional, if you want to handle multiple dates
}) {
  if (!title || !category_idguid || !user_idguid)
    throw new Error('Nedostaje neki od obaveznih podataka title ili kategorija');

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('location_idguid', location_idguid || '');
    formData.append('start_date', start_date);
    formData.append('end_date', end_date || '');
    formData.append('cijena', cijena || '');
    formData.append('is_public', is_public);
    formData.append('category_idguid', category_idguid);
    formData.append('user_idguid', user_idguid);
    formData.append('institucijaIdguid', institucija_idguid);
    formData.append('ima_vise_termina', ima_vise_termina);
    formData.append('termini', termini);

    // Append the file with field name 'image' or whatever your backend expects
    if (slika instanceof FileList) {
      formData.append('slika', slika[0]);
    }

    const response = await axiosInstance.post(`/events/events`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dodavanju događaja');
  }
}

export async function deleteEvent(id) {
  if (!id) throw new Error('Event ID is required');

  try {
    await axiosInstance.delete(`/events/events/${id}`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri brisanju događaja');
  }
}

export async function updateEvent({
  data: {
    title,
    description,
    start_date,
    end_date,
    location_idguid,
    user_idguid,
    category_idguid,
    is_public,
    slika,
    cijena,
    institucija_idguid,
    ima_vise_termina,
    termini,
  },
  editId: id,
  // Image url
}) {
  if (!id) throw new Error('Event ID is required');
  if (!title) throw new Error('Nedostaju neki od obaveznih podataka');

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('location_idguid', location_idguid || '');
    formData.append('start_date', start_date);
    formData.append('end_date', end_date || '');
    formData.append('is_public', is_public);
    formData.append('cijena', cijena);
    formData.append('category_idguid', category_idguid);
    formData.append('institucijaIdguid', institucija_idguid);
    formData.append('user_idguid', user_idguid);
    formData.append('ima_vise_termina', ima_vise_termina);
    formData.append('termini', termini);

    if (slika instanceof FileList && slika.length > 0) {
      formData.append('slika', slika[0]);
    }

    // POPRAVITI Edhem samo jos da napravi provjeru na backendu
    // if (slika === null) {
    //   formData.append('remove_slika', 'true');
    // }

    const response = await axiosInstance.put(`/events/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju događaja');
  }
}

export async function updateEventDeleteImage({ id }) {
  console.log('ID: ', id);

  try {
    const response = await axiosInstance.delete(`/events/events/remove-image/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju događaja');
  }
}
