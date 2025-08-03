// import { useForm } from 'react-hook-form';

// import Input from '../../ui/Input';
// import Form from '../../ui/Form';
// import Button from '../../ui/Button';
// import TextArea from '../../ui/TextArea';
// import FormRow from '../../ui/FormRow';
// import FormField from '../../ui/FormField';

// import { usePostLocation } from './usePostLocation';
// import { useUpdateLocation } from './useUpdateLocation';

// // POPRAVITI MAPA POKUSAJ MANUALNO
// // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// function CreateLocationForm({ locationToEdit = {}, onCloseModal }) {
//   const { isCreating, postLocation } = usePostLocation();
//   const { isEditing, updateLocation } = useUpdateLocation();
//   const isWorking = isCreating || isEditing;

//   const { idguid: editId, ...editValues } = locationToEdit;
//   const isEditSession = Boolean(editId);

//   const { register, handleSubmit, reset, formState } = useForm({
//     defaultValues: isEditSession ? editValues : {},
//   });
//   const { errors } = formState;

//   function onSubmit(data) {
//     if (isEditSession)
//       updateLocation(
//         { data, editId },
//         {
//           onSuccess: () => {
//             reset();
//             onCloseModal?.();
//           },
//         }
//       );
//     else
//       postLocation(
//         { ...data },
//         {
//           onSuccess: () => {
//             reset();
//             onCloseModal?.();
//           },
//         }
//       );
//   }

//   function onError() {
//     // console.log(errors);
//   }

//   return (
//     <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
//       <FormRow columns="1fr 1fr">
//         <FormField label="Naziv lokacije" error={errors?.naziv?.message} required>
//           <Input
//             autoFocus
//             type="text"
//             id="naziv"
//             disabled={isWorking}
//             {...register('naziv', {
//               required: 'Ovo polje je obavezno',
//             })}
//           />
//         </FormField>
//         <FormField label="Adresa" error={errors?.adresa?.message} required>
//           <Input
//             type="text"
//             id="adresa"
//             disabled={isWorking}
//             {...register('adresa', {
//               required: 'Ovo polje je obavezno',
//             })}
//           />
//         </FormField>
//       </FormRow>
//       <FormRow></FormRow>
//       <FormRow columns="1fr 1fr">
//         <FormField label="Longitude" error={errors?.longitude?.message} required>
//           <Input
//             type="text"
//             id="longitude"
//             disabled
//             {...register('longitude', {
//               required: 'Ovo polje je obavezno',
//             })}
//           />
//         </FormField>
//         <FormField label="Latitude" error={errors?.latitude?.message} required>
//           <Input
//             type="text"
//             id="latitude"
//             disabled
//             {...register('latitude', {
//               required: 'Ovo polje je obavezno',
//             })}
//           />
//         </FormField>
//       </FormRow>
//       <FormRow>
//         <FormField label="Opis lokacije" error={errors?.opis?.message}>
//           <TextArea
//             type="text"
//             id="opis"
//             defaultValue=""
//             disabled={isWorking}
//             {...register('opis')}
//           />
//         </FormField>
//       </FormRow>
//       <FormRow>
//         <FormField label="Mjesto" error={errors?.mjesto?.message}>
//           <Input type="text" id="mjesto" disabled={isWorking} {...register('mjesto')} />
//         </FormField>
//       </FormRow>
//       <FormRow>
//         <Button
//           title="Odustani"
//           variation="secondary"
//           type="reset"
//           size="small"
//           onClick={() => onCloseModal?.()}
//         >
//           Odustani
//         </Button>
//         <Button
//           title={isEditSession ? 'Uredi lokaciju' : 'Dodaj novu lokaciju'}
//           size="small"
//           variation="primary"
//           disabled={isWorking}
//         >
//           {isEditSession ? 'Uredi lokaciju' : 'Dodaj novu lokaciju'}
//         </Button>
//       </FormRow>
//     </Form>
//   );
// }

// export default CreateLocationForm;

// VERZIJA 2
// import { useState, useRef } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import styled from 'styled-components';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// import Input from '../../ui/Input';
// import Form from '../../ui/Form';
// import Button from '../../ui/Button';
// import TextArea from '../../ui/TextArea';
// import FormRow from '../../ui/FormRow';
// import FormField from '../../ui/FormField';

// import { usePostLocation } from './usePostLocation';
// import { useUpdateLocation } from './useUpdateLocation';

// // === Autocomplete for address ===
// const SuggestionsBox = styled.ul`
//   position: absolute;
//   z-index: 9999;
//   background: #fff;
//   border: 1px solid #eee;
//   width: 100%;
//   max-height: 180px;
//   overflow-y: auto;
//   margin: 0;
//   padding: 0;
//   list-style: none;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
// `;

// const Suggestion = styled.li`
//   padding: 8px 12px;
//   cursor: pointer;
//   &:hover {
//     background: #f2f2f2;
//   }
// `;

// function AddressAutocomplete({ value, onChange, setGeoData, disabled, error }) {
//   const [suggestions, setSuggestions] = useState([]);
//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const timeoutRef = useRef();
//   const containerRef = useRef();

//   // Općina Tešanj bounding box (approx). You may refine these coordinates.
//   const TESANJ_BBOX = '17.958,44.547,18.113,44.687';

//   const handleInputChange = (e) => {
//     const val = e.target.value;
//     onChange(val);
//     setShow(true);
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     if (!val || val.length < 2) {
//       setSuggestions([]);
//       return;
//     }
//     timeoutRef.current = setTimeout(async () => {
//       setLoading(true);
//       try {
//         // Nominatim, ograničeno na BiH, Tešanj bbox
//         const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=ba&limit=8&q=${encodeURIComponent(
//           val + ' Tešanj'
//         )}&viewbox=${TESANJ_BBOX}&bounded=1`;
//         const res = await fetch(url);
//         const data = await res.json();
//         setSuggestions(
//           data.map((item) => ({
//             display_name: item.display_name,
//             lat: item.lat,
//             lon: item.lon,
//             address: item.address,
//           }))
//         );
//       } catch {
//         setSuggestions([]);
//       }
//       setLoading(false);
//     }, 350); // debounce
//   };

//   const handleSuggestionClick = (s) => {
//     setShow(false);
//     onChange(s.display_name);
//     setGeoData({
//       latitude: parseFloat(s.lat),
//       longitude: parseFloat(s.lon),
//       adresa: s.display_name,
//       mjesto: s.address?.city || s.address?.town || s.address?.village || '',
//     });
//   };

//   // Hide suggestions when clicking outside
//   const handleBlur = (e) => {
//     console.log(e);
//     setTimeout(() => setShow(false), 120);
//   };

//   return (
//     <div style={{ position: 'relative' }} ref={containerRef}>
//       <Input
//         type="text"
//         value={value || ''}
//         disabled={disabled}
//         autoComplete="off"
//         placeholder="Unesi adresu (npr. Trg Alija Izetbegovića 1, Tešanj)"
//         onChange={handleInputChange}
//         onFocus={() => setShow(true)}
//         onBlur={handleBlur}
//         id="adresa"
//         error={error}
//       />
//       {show && suggestions.length > 0 && (
//         <SuggestionsBox>
//           {suggestions.map((s, i) => (
//             <Suggestion key={i} onMouseDown={() => handleSuggestionClick(s)}>
//               {s.display_name}
//             </Suggestion>
//           ))}
//         </SuggestionsBox>
//       )}
//       {show && !loading && suggestions.length === 0 && value && value.length > 2 && (
//         <SuggestionsBox>
//           <Suggestion>Nema rezultata</Suggestion>
//         </SuggestionsBox>
//       )}
//       {show && loading && (
//         <SuggestionsBox>
//           <Suggestion>Pretraživanje...</Suggestion>
//         </SuggestionsBox>
//       )}
//     </div>
//   );
// }

// // === Map picker ===
// function LocationMarker({ lat, lng, onChange }) {
//   const [position, setPosition] = useState(lat && lng ? [lat, lng] : null);

//   useMapEvents({
//     click(e) {
//       setPosition([e.latlng.lat, e.latlng.lng]);
//       onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
//     },
//   });

//   return position === null ? null : (
//     <Marker
//       position={position}
//       icon={L.icon({
//         iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//         iconSize: [25, 41],
//         iconAnchor: [12, 41],
//       })}
//     />
//   );
// }

// function LocationMapPicker({ latitude, longitude, onChange }) {
//   const center = latitude && longitude ? [latitude, longitude] : [44.6125, 17.9865]; // Tešanj center

//   return (
//     <div
//       style={{
//         height: 350,
//         width: '100%',
//         marginBottom: 16,
//         borderRadius: 8,
//         overflow: 'hidden',
//         border: '1px solid #eaeaea',
//       }}
//     >
//       <MapContainer center={center} zoom={13} style={{ height: 350, width: '100%' }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         <LocationMarker lat={latitude} lng={longitude} onChange={onChange} />
//       </MapContainer>
//     </div>
//   );
// }

// // Komponenta za upravljanje centrom mape

// // === MAIN FORM ===
// function CreateLocationForm({ locationToEdit = {}, onCloseModal }) {
//   const { isCreating, postLocation } = usePostLocation();
//   const { isEditing, updateLocation } = useUpdateLocation();
//   const isWorking = isCreating || isEditing;

//   const { idguid: editId, ...editValues } = locationToEdit;
//   const isEditSession = Boolean(editId);

//   // Default values, popuni polja ili prazno
//   const { register, handleSubmit, reset, control, setValue, watch, formState } = useForm({
//     defaultValues: isEditSession
//       ? editValues
//       : {
//           naziv: '',
//           opis: '',
//           adresa: '',
//           latitude: '',
//           longitude: '',
//           mjesto: '',
//         },
//   });
//   const { errors } = formState;

//   // Sync: kada odaberemo adresu ili kliknemo na mapu
//   const setGeoData = ({ latitude, longitude, adresa, mjesto }) => {
//     setValue('latitude', latitude);
//     setValue('longitude', longitude);
//     if (adresa) setValue('adresa', adresa);
//     if (mjesto !== undefined) setValue('mjesto', mjesto);
//   };

//   // Sync: klik na mapu
//   const handleMapPosition = ({ lat, lng }) => {
//     setGeoData({ latitude: lat, longitude: lng });
//   };

//   function onSubmit(data) {
//     if (isEditSession)
//       updateLocation(
//         { data, editId },
//         {
//           onSuccess: () => {
//             reset();
//             onCloseModal?.();
//           },
//         }
//       );
//     else
//       postLocation(
//         { ...data },
//         {
//           onSuccess: () => {
//             reset();
//             onCloseModal?.();
//           },
//         }
//       );
//   }

//   function onError() {
//     // console.log(errors);
//   }

//   // Watch for lat/lng so map and inputs are always in sync
//   const latitude = Number(watch('latitude'));
//   const longitude = Number(watch('longitude'));

//   return (
//     <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
//       <FormRow columns="1fr 1fr">
//         <FormField label="Naziv lokacije" error={errors?.naziv?.message} required>
//           <Input
//             autoFocus
//             type="text"
//             id="naziv"
//             disabled={isWorking}
//             {...register('naziv', {
//               required: 'Ovo polje je obavezno',
//             })}
//           />
//         </FormField>
//         <FormField label="Adresa" error={errors?.adresa?.message} required>
//           <Controller
//             name="adresa"
//             control={control}
//             rules={{ required: 'Ovo polje je obavezno' }}
//             render={({ field }) => (
//               <AddressAutocomplete
//                 value={field.value}
//                 onChange={field.onChange}
//                 setGeoData={setGeoData}
//                 disabled={isWorking}
//                 error={errors?.adresa?.message}
//               />
//             )}
//           />
//         </FormField>
//       </FormRow>
//       <FormRow>
//         <LocationMapPicker latitude={latitude} longitude={longitude} onChange={handleMapPosition} />
//       </FormRow>

//       <FormRow columns="1fr 1fr">
//         <FormField label="Latitude">
//           <Input
//             type="number"
//             id="latitude"
//             value={latitude || ''}
//             disabled
//             {...register('latitude')}
//           />
//         </FormField>
//         <FormField label="Longitude">
//           <Input
//             type="number"
//             id="longitude"
//             value={longitude || ''}
//             disabled
//             {...register('longitude')}
//           />
//         </FormField>
//       </FormRow>

//       <FormRow>
//         <FormField label="Opis lokacije" error={errors?.opis?.message}>
//           <TextArea
//             type="text"
//             id="opis"
//             defaultValue=""
//             disabled={isWorking}
//             {...register('opis')}
//           />
//         </FormField>
//       </FormRow>
//       <FormRow>
//         <FormField label="Mjesto" error={errors?.mjesto?.message}>
//           <Input type="text" id="mjesto" disabled={isWorking} {...register('mjesto')} />
//         </FormField>
//       </FormRow>

//       <FormRow>
//         <Button
//           title="Odustani"
//           variation="secondary"
//           type="reset"
//           size="small"
//           onClick={() => onCloseModal?.()}
//         >
//           Odustani
//         </Button>
//         <Button
//           title={isEditSession ? 'Uredi lokaciju' : 'Dodaj novu lokaciju'}
//           size="small"
//           variation="primary"
//           disabled={isWorking}
//         >
//           {isEditSession ? 'Uredi lokaciju' : 'Dodaj novu lokaciju'}
//         </Button>
//       </FormRow>
//     </Form>
//   );
// }

// export default CreateLocationForm;

// VERZIJA 3
import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import { MapContainer, TileLayer, useMap, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import TextArea from '../../ui/TextArea';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';

import { usePostLocation } from './usePostLocation';
import { useUpdateLocation } from './useUpdateLocation';
import { useUserProfile } from '../authentication/useUserProfile';

// === Styled Components ===
const SuggestionsBox = styled.ul`
  position: absolute;
  /* z-index: 999; */
  background: #fff;
  border: 1px solid #eee;
  width: 100%;
  max-height: 180px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border-radius: 4px;
  top: 100%;
`;

const Suggestion = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;

  &:hover {
    background: #f2f2f2;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const MapWrapper = styled.div`
  height: 25rem;
  width: 100%;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eaeaea;
  position: relative;
`;

const CoordinateInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

// === Address Autocomplete Component ===
function AddressAutocomplete({ value, onChange, setGeoData, disabled, error }) {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef();

  // Tešanj bounding box
  const TESANJ_BBOX = '17.958,44.547,18.113,44.687';

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setShow(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!val || val.length < 2) {
      setSuggestions([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const searchQuery = val.includes('Tešanj') ? val : `${val} Tešanj`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=ba&accept-language=lat&limit=8&q=${encodeURIComponent(
          searchQuery
        )}&viewbox=${TESANJ_BBOX}&bounded=1&accept-language=lat`;

        const res = await fetch(url);
        const data = await res.json();

        setSuggestions(
          data.map((item) => ({
            display_name: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            address: item.address,
          }))
        );
      } catch (error) {
        console.error('Geocoding error:', error);
        setSuggestions([]);
      }
      setLoading(false);
    }, 350);
  };

  const handleSuggestionClick = (suggestion) => {
    setShow(false);
    onChange(suggestion.display_name);
    setGeoData({
      latitude: suggestion.lat,
      longitude: suggestion.lon,
      adresa: suggestion.display_name,
      mjesto:
        suggestion.address?.city ||
        suggestion.address?.town ||
        suggestion.address?.village ||
        'Tešanj',
    });
  };

  const handleBlur = () => {
    // Delay hiding to allow click events on suggestions
    setTimeout(() => setShow(false), 150);
  };

  const handleFocus = () => {
    if (value && value.length > 2) {
      setShow(true);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Input
        type="text"
        value={value || ''}
        disabled={disabled}
        autoComplete="off"
        style={{ width: '100%' }}
        placeholder="Unesi adresu (npr. Trg Alija Izetbegovića 1, Tešanj)"
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        id="adresa"
        error={error}
      />
      {show && (
        <SuggestionsBox>
          {loading ? (
            <Suggestion>Pretraživanje...</Suggestion>
          ) : suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <Suggestion key={i} onMouseDown={() => handleSuggestionClick(s)}>
                {s.display_name}
              </Suggestion>
            ))
          ) : value && value.length > 2 ? (
            <Suggestion>Nema rezultata</Suggestion>
          ) : null}
        </SuggestionsBox>
      )}
    </div>
  );
}

// === Map Components ===
function MapCenter({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
}

function LocationMarker({ lat, lng, onChange }) {
  const [position, setPosition] = useState(null);

  // Update position when props change
  useEffect(() => {
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
    } else {
      setPosition(null);
    }
  }, [lat, lng]);

  useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  // Create custom marker icon
  const markerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

function LocationMapPicker({ latitude, longitude, onChange }) {
  const defaultCenter = [44.6125, 17.9865]; // Tešanj center
  const center =
    latitude && longitude && !isNaN(latitude) && !isNaN(longitude)
      ? [latitude, longitude]
      : defaultCenter;

  return (
    <MapWrapper>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapCenter center={center} />
        <LocationMarker lat={latitude} lng={longitude} onChange={onChange} />
      </MapContainer>
    </MapWrapper>
  );
}

// === Main Form Component ===
function CreateLocationForm({ locationToEdit = {}, user_email, onCloseModal }) {
  const { isCreating, postLocation } = usePostLocation();
  const { isEditing, updateLocation } = useUpdateLocation();

  const { user: myProfile } = useUserProfile();
  const userEmail = myProfile?.data?.user?.email || '';

  const isWorking = isCreating || isEditing;

  const { idguid: editId, ...editValues } = locationToEdit;
  const isEditSession = Boolean(editId);

  // Initialize form with proper default values
  const { register, handleSubmit, reset, control, setValue, watch, formState } = useForm({
    defaultValues: isEditSession
      ? {
          ...editValues,
          latitude: editValues.latitude || '',
          longitude: editValues.longitude || '',
        }
      : {
          naziv: '',
          opis: '',
          adresa: '',
          latitude: '',
          longitude: '',
          mjesto: '',
        },
  });

  const { errors } = formState;

  // Watch coordinates for real-time updates
  const watchedLatitude = watch('latitude');
  const watchedLongitude = watch('longitude');

  // Convert to numbers for map
  const latitude = watchedLatitude ? parseFloat(watchedLatitude) : null;
  const longitude = watchedLongitude ? parseFloat(watchedLongitude) : null;

  // Update form when geocoding or map clicking occurs
  const setGeoData = ({ latitude, longitude, adresa, mjesto }) => {
    if (latitude !== undefined) setValue('latitude', latitude);
    if (longitude !== undefined) setValue('longitude', longitude);
    if (adresa) setValue('adresa', adresa);
    if (mjesto !== undefined) setValue('mjesto', mjesto);
  };

  // Handle map click
  const handleMapPosition = ({ lat, lng }) => {
    setGeoData({ latitude: lat, longitude: lng });

    // Reverse geocode to get address
    reverseGeocode(lat, lng);
  };

  // Reverse geocoding function
  const reverseGeocode = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.display_name) {
        setValue('adresa', data.display_name);
        const mjesto =
          data.address?.city || data.address?.town || data.address?.village || 'Tešanj';
        setValue('mjesto', mjesto);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  // Form submission
  function onSubmit(data) {
    // Ensure coordinates are numbers
    const formData = {
      ...data,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    };

    if (isEditSession) {
      updateLocation(
        { data: formData, editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      postLocation(formData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  function onError(errors) {
    console.log('Form errors:', errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow>
        <LocationMapPicker latitude={latitude} longitude={longitude} onChange={handleMapPosition} />
      </FormRow>
      <FormRow columns="1fr 1fr">
        <FormField label="Naziv lokacije" error={errors?.naziv?.message} required>
          <Input
            autoFocus
            type="text"
            style={{ zIndex: 1 }}
            id="naziv"
            disabled={isWorking}
            {...register('naziv', {
              required: 'Ovo polje je obavezno',
            })}
          />
        </FormField>

        <FormField label="Adresa" error={errors?.adresa?.message} required>
          <Controller
            name="adresa"
            control={control}
            rules={{ required: 'Ovo polje je obavezno' }}
            render={({ field }) => (
              <AddressAutocomplete
                value={field.value}
                onChange={field.onChange}
                setGeoData={setGeoData}
                disabled={isWorking}
                error={errors?.adresa?.message}
              />
            )}
          />
        </FormField>
      </FormRow>
      <FormRow columns="1fr 1fr">
        <FormField label="Mjesto" required error={errors?.mjesto?.message}>
          <Input
            type="text"
            id="mjesto"
            style={{ zIndex: 1 }}
            disabled={isWorking}
            {...register('mjesto')}
          />
        </FormField>
        <FormField label="Korisnik">
          <Input type="text" id="user" disabled value={isEditSession ? user_email : userEmail} />
        </FormField>
      </FormRow>
      <FormRow>
        <CoordinateInputs>
          <FormField label="Latitude" error={errors?.latitude?.message}>
            <Input
              type="number"
              step="any"
              id="latitude"
              disabled
              {...register('latitude', {
                required: 'Koordinate su obavezne',
                valueAsNumber: true,
              })}
            />
          </FormField>

          <FormField label="Longitude" error={errors?.longitude?.message}>
            <Input
              type="number"
              step="any"
              id="longitude"
              disabled
              {...register('longitude', {
                required: 'Koordinate su obavezne',
                valueAsNumber: true,
              })}
            />
          </FormField>
        </CoordinateInputs>
      </FormRow>
      <FormRow>
        <FormField label="Opis lokacije" error={errors?.opis?.message}>
          <TextArea id="opis" disabled={isWorking} rows={4} {...register('opis')} />
        </FormField>
      </FormRow>

      <FormRow buttons="has">
        <Button
          variation="secondary"
          type="button"
          size="small"
          onClick={() => onCloseModal?.()}
          disabled={isWorking}
        >
          Odustani
        </Button>

        <Button size="small" variation="primary" disabled={isWorking} type="submit">
          {isEditSession ? 'Uredi lokaciju' : 'Dodaj novu lokaciju'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateLocationForm;
