import axiosInstance from './axiosInstance';

export async function getCategories() {
  const response = await axiosInstance.get(`/events/kategorije`);
  return response.data;
}

export async function getCategory() {
  const response = await axiosInstance.get(
    `/events/kategorije/4a5b1adb-516a-4f90-a90a-b6af65659545`
  );
  return response.data;
}

// export async function postEvent({
//   title,
//   description,
//   location,
//   start_date,
//   end_date,
//   is_public,
//   category_idguid,
// }) {
//   const response = await axiosInstance.post(`/events/events`, {
//     title,
//     description,
//     location,
//     is_public,
//     end_date,
//     start_date,
//     category_idguid,
//     user_idguid: 'bd64f803-b938-4d66-959c-0e14dfb99052',
//   });
//   return response.data;
// }

// export async function deleteEvent(id) {
//   await axiosInstance.delete(`/events/events/${id}`);
//   return id;
// }
