import axiosInstance from './axiosInstance';

export async function getSettings() {
  try {
    const response = await axiosInstance.get(`/admin/settings/`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri dobavljanju postavki');
  }
}

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
    const response = await axiosInstance.put(`/admin/settings/`, {
      site_name,
      site_active,
      site_copyright,
      address,
      email,
      phone_number,
      facebook_link,
      site_link,
      favicon16x16,
      site_logo,
      registracija,
      google_login,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Greška pri ažuriranju postavki');
  }
}

// POPRAVITI DODATI KADA EDHEM POPRAVI PRIHVATANJE DOKUMENATA
// export async function updateSettings({ data }) {
//   try {
//     const formData = new FormData();

//     // Dodaj sve tekstualne i booleanske vrijednosti kao stringove
//     formData.append('site_name', data.site_name || '');
//     formData.append('site_active', data.site_active ? '1' : '0');
//     formData.append('site_copyright', data.site_copyright || '');
//     formData.append('address', data.address || '');
//     formData.append('email', data.email || '');
//     formData.append('phone_number', data.phone_number || '');
//     formData.append('facebook_link', data.facebook_link || '');
//     formData.append('site_link', data.site_link || '');
//     formData.append('registracija', data.registracija ? '1' : '0');
//     formData.append('google_login', data.google_login ? '1' : '0');

//     // Dodaj slike ako postoje
//     if (data.site_logo instanceof FileList && data.site_logo.length > 0) {
//       formData.append('site_logo', data.site_logo[0]);
//     } else if (data.site_logo instanceof File) {
//       formData.append('site_logo', data.site_logo);
//     }

//     if (data.favicon16x16 instanceof FileList && data.favicon16x16.length > 0) {
//       formData.append('favicon16x16', data.favicon16x16[0]);
//     } else if (data.favicon16x16 instanceof File) {
//       formData.append('favicon16x16', data.favicon16x16);
//     }

//     // Debug: loguj sve što se šalje
//     for (let pair of formData.entries()) {
//       console.log(`${pair[0]}:`, pair[1]);
//     }

//     const response = await axiosInstance.put(`/admin/settings/`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error('Greška pri ažuriranju:', error);
//     throw new Error(error.response?.data?.message || 'Greška pri ažuriranju postavki');
//   }
// }
