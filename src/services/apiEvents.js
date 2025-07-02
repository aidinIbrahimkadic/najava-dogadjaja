import axiosInstance from './axiosInstance';

export async function getEvents() {
  try {
    const response = await axiosInstance.get(`/events/events`);
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
  category_idguid,
  user_idguid,
}) {
  if (!title || !start_date || !category_idguid || !user_idguid)
    throw new Error('Nedostaje neki od obaveznih podataka title, start date ili kategorija');

  try {
    const response = await axiosInstance.post(`/events/events`, {
      title,
      description,
      location,
      is_public,
      end_date,
      start_date,
      category_idguid,
      user_idguid,
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
