import axiosInstance from './axiosInstance';

export async function getEvents() {
  const response = await axiosInstance.get(`/events/events`);
  return response.data;
}
export async function postEvent({
  title,
  description,
  location,
  start_date,
  end_date,
  is_public,
  category_idguid,
}) {
  const response = await axiosInstance.post(`/events/events`, {
    title,
    description,
    location,
    is_public,
    end_date,
    start_date,
    category_idguid,
    user_idguid: 'bd64f803-b938-4d66-959c-0e14dfb99052',
  });
  return response.data;
}
