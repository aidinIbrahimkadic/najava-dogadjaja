import axiosInstance from './axiosInstance';

export async function getEvents() {
  try {
    const response = await axiosInstance.get(`/events/events`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function postEvent({
  title,
  description,
  location,
  start_date,
  end_date,
  is_public,
  slika,
  category_idguid,
  user_idguid,
}) {
  if (!title || !start_date || !category_idguid || !user_idguid)
    throw new Error('Nedostaje neki od obaveznih podataka title, start date ili kategorija');

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('location', location || '');
    formData.append('start_date', start_date);
    formData.append('end_date', end_date || '');
    formData.append('is_public', is_public);
    formData.append('category_idguid', category_idguid);
    formData.append('user_idguid', user_idguid);

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
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteEvent(id) {
  if (!id) throw new Error('Event ID is required');

  try {
    await axiosInstance.delete(`/events/events/${id}`);
    return id;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateEvent({
  data: {
    title,
    description,
    start_date,
    end_date,
    location,
    user_idguid,
    category_idguid,
    is_public,
    slika,
  },
  editId: id,
  // Image url
}) {
  if (!id) throw new Error('Event ID is required');
  if (!title || !start_date)
    throw new Error('Nedostaju neki od obaveznih podataka: title, start date, category, user');

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    formData.append('location', location || '');
    formData.append('start_date', start_date);
    formData.append('end_date', end_date || '');
    formData.append('is_public', is_public);
    formData.append('category_idguid', category_idguid);
    formData.append('user_idguid', user_idguid);

    if (slika instanceof FileList && slika.length > 0) {
      formData.append('slika', slika[0]);
    }

    // POPRAVITI Edhem samo jos da napravi provjeru na backendu
    if (slika === null) {
      formData.append('remove_slika', 'true');
    }
    console.log('UPDATE SLIKE:', slika);

    const response = await axiosInstance.put(`/events/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
