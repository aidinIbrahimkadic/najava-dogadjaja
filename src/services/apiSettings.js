import axiosInstance from './axiosInstance';

export async function getSettings() {
  try {
    const response = await axiosInstance.get(`/admin/settings/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju postavki');
  }
}

// export async function updateSettings({
//   data: {
//     site_name,
//     site_active,
//     site_copyright,
//     address,
//     email,
//     phone_number,
//     facebook_link,
//     site_link,
//     site_logo,
//     favicon16x16,
//     registracija,
//     google_login,
//   },
// }) {
//   try {
//     const response = await axiosInstance.put(`/admin/settings/`, {
//       site_name,
//       site_active,
//       site_copyright,
//       address,
//       email,
//       phone_number,
//       facebook_link,
//       site_link,
//       favicon16x16,
//       site_logo,
//       registracija,
//       google_login,
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Greška pri ažuriranju postavki');
//   }
// }

export async function updateSettings({
  data: {
    site_name,
    site_active,
    site_copyright,
    address,
    email,
    phone_number,
    facebook_link,
    site_link,
    site_logo,
    favicon16x16,
    registracija,
    google_login,
  },
}) {
  try {
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        if (!(file instanceof File)) return resolve(file); // već base64 string ili null
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    let logoFile;
    let iconFile;

    if (site_logo instanceof FileList) {
      logoFile = site_logo?.[0];
    } else {
      logoFile = site_logo;
    }

    if (favicon16x16 instanceof FileList) {
      iconFile = favicon16x16?.[0];
    } else {
      iconFile = favicon16x16;
    }

    const logoBase64 = await toBase64(logoFile);
    const iconBase64 = await toBase64(iconFile);

    const response = await axiosInstance.put(`/admin/settings/`, {
      site_name,
      site_active,
      site_copyright,
      address,
      email,
      phone_number,
      facebook_link,
      site_link,
      site_logo: logoBase64,
      favicon16x16: iconBase64,
      registracija,
      google_login,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju postavki');
  }
}
