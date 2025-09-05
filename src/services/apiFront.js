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

export async function getAllSettings() {
  try {
    const response = await axiosInstance.get(`/settings`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju postavki');
  }
}

export async function getEventById(id) {
  if (!id) throw new Error('Event ID is required');

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

export async function getAllInstitutions() {
  try {
    const response = await axiosInstance.get(`/institucije?limit=100`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju institucija');
  }
}

export async function getInstitutionById(id) {
  if (!id) throw new Error('Institution ID is required');

  try {
    const response = await axiosInstance.get(`/institucije/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getEventsByInstitution(id) {
  if (!id) throw new Error('Institution ID is required');
  const { data } = await axiosInstance.get('/events', {
    params: {
      institucija_idguid: id,
      upcoming_only: 'true',
      limit: 4,
      sortBy: 'start_date',
      sortOrder: 'ASC',
    },
  });
  return data;
}

export async function getSingleCategory({ id }) {
  if (!id) throw new Error('Category ID is required');

  try {
    const response = await axiosInstance.get(`/kategorije/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju kategorije');
  }
}

export async function getProxyShare({ id }) {
  if (!id) throw new Error('Event ID is required');

  try {
    const response = await axiosInstance.get(`/events-share/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dijeljenju događaja');
  }
}

export async function getAllUpcomingManifestations() {
  try {
    const response = await axiosInstance.get(`/manifestacije/upcoming`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju manifestacija');
  }
}

export async function getAllEventsFromManifestation({ id }) {
  try {
    const response = await axiosInstance.get(`/manifestacije/events/${id}?limit=100`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Greška pri dobavljanju događaja manifestacija'
    );
  }
}

export async function getSingleManifestation({ id }) {
  if (!id) throw new Error('Manifestation ID is required');

  try {
    const response = await axiosInstance.get(`/manifestacije/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju manifestacije');
  }
}
