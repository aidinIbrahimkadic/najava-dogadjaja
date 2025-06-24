import axiosInstance from './axiosInstance';

export async function getEvents() {
  const response = await axiosInstance.get(`/events/events`);
  return response.data;
}
export async function postEvent({ title, description, location, start_date, end_date, is_public }) {
  const response = await axiosInstance.post(`/events/events`, {
    title,
    description,
    location,
    is_public,
    end_date,
    start_date,
  });
  return response.data;
}
