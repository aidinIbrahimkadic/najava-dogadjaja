import axiosInstance from './axiosInstance';

export async function getEvents() {
  try {
    const response = await axiosInstance.get(`/events/events`);
    console.log('EVENTS: ', response.data);
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
  image_url,
  category_idguid,
  user_idguid,
}) {
  if (!title || !start_date || !category_idguid || !user_idguid)
    throw new Error('Nedostaje neki od obaveznih podataka title, start date ili kategorija');

  console.log('IZ EVENT API', description);
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
    if (image_url instanceof FileList) {
      // POPRAVITI Edhem info o file polju
      console.log('File object:', image_url[0]);
      console.log('File name:', image_url[0]?.name);

      formData.append('image_file', image_url[0]);
      formData.append('image_url', image_url[0]?.name);
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

  // try {
  //   console.log('Image URL: ', image_url);
  //   const response = await axiosInstance.post(`/events/events`, {
  //     title,
  //     description,
  //     location,
  //     is_public,
  //     end_date,
  //     start_date,
  //     image_url,
  //     category_idguid,
  //     user_idguid,
  //   });
  //   return response.data;
  // } catch (err) {
  //   console.log(err);
  //   throw err;
  // }
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
  },
  editId: id,
  // Image url
}) {
  if (!id) throw new Error('Event ID is required');
  if (!title || !start_date)
    throw new Error('Nedostaju neki od obaveznih podataka: title, start date, category, user');

  try {
    const response = await axiosInstance.put(`/events/events/${id}`, {
      title,
      description,
      location,
      end_date,
      start_date,
      category_idguid,
      is_public,
      user_idguid,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
